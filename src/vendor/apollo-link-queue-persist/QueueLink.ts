import {
    ApolloLink,
    Operation,
    FetchResult,
    NextLink,
    DocumentNode,
} from '@apollo/client/link/core';
import {Observable, Observer} from '@apollo/client/utilities';

export const createGuid = () => {
    function _p8(s: boolean) {
        var p = (Math.random().toString(16) + '000000000').substring(2, 10);
        return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 8) : p;
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
};

export interface OperationQueueEntry {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
    subscription?: {unsubscribe: () => void};
}

type OperationTypeNode = 'query' | 'mutation' | 'subscription';
type event = 'dequeue' | 'enqueue' | 'change';

interface Listener {
    id: string;
    callback: (entry: any) => void;
}

export default class QueueLink extends ApolloLink {
    static listeners: Record<string, Listener[]> = {};
    static filter: OperationTypeNode[] = [];
    private opQueue: OperationQueueEntry[] = [];
    private isOpen = true;

    public clear() {
        this.opQueue = [];
        this.triggerChangeListeners();
    }

    public length = () => this.opQueue.length;

    public isType(query: DocumentNode, type: OperationTypeNode): boolean {
        return (
            query.definitions.filter(e => {
                return (e as any).operation === type;
            }).length > 0
        );
    }

    private isFilteredOut(operation: Operation): boolean {
        if (!QueueLink.filter || !QueueLink.filter.length) {
            return false;
        }
        return (
            operation.query.definitions.filter(e => {
                return QueueLink.filter.includes((e as any).operation);
            }).length > 0
        );
    }

    public getQueue = () => this.opQueue;

    public open() {
        this.isOpen = true;
        const opQueueCopy = [...this.opQueue];
        this.opQueue = [];
        opQueueCopy.forEach(entry => {
            this.triggerListeners(entry, 'dequeue');

            entry.forward(entry.operation).subscribe(entry.observer);
        });
    }

    public static addLinkQueueEventListener = (
        opName: string,
        event: event,
        callback: (entry: any) => void,
    ) => {
        if (event === 'change') {
            opName = '';
        }
        const key: string = QueueLink.key(opName, event);

        const newGuid = createGuid();

        const newListener = {
            [key]: [
                ...(key in QueueLink.listeners ? QueueLink.listeners[key] : []),
                ...[{id: newGuid, callback: callback}],
            ],
        };

        QueueLink.listeners = {...QueueLink.listeners, ...newListener};

        return newGuid;
    };

    public static removeLinkQueueEventListener = (
        opName: string,
        event: event,
        id: string,
    ) => {
        if (event === 'change') {
            opName = '';
        }
        const key: string = QueueLink.key(opName, event);

        if (QueueLink.listeners[key] !== undefined) {
            QueueLink.listeners[key] = QueueLink.listeners[key].filter(
                listener => listener.id !== id,
            );

            if (QueueLink.listeners[key].length === 0) {
                delete QueueLink.listeners[key];
            }
        }
    };

    public close() {
        this.isOpen = false;
    }

    public request(operation: Operation, forward: NextLink) {
        if (this.isOpen) {
            return forward(operation);
        }
        if (operation.getContext().skipQueue) {
            return forward(operation);
        }
        if (this.isFilteredOut(operation)) {
            return forward(operation);
        }
        return new Observable<FetchResult>(
            (observer: Observer<FetchResult>) => {
                const operationEntry = {operation, forward, observer};
                this.enqueue(operationEntry);
                return () => this.cancelOperation(operationEntry);
            },
        );
    }

    public static setFilter = (filter: OperationTypeNode[]) => {
        QueueLink.filter = filter;
    };

    private static key(op: string, ev: string) {
        return `${op}${ev}`.toLocaleLowerCase();
    }

    private cancelOperation(entry: OperationQueueEntry) {
        this.opQueue = this.opQueue.filter(e => e !== entry);
    }

    private enqueue(entry: OperationQueueEntry) {
        this.opQueue.push(entry);

        this.triggerListeners(entry, 'enqueue');
    }

    private triggerListeners(entry: OperationQueueEntry, event: string) {
        const key: string = QueueLink.key(entry.operation.operationName, event);
        if (key in QueueLink.listeners) {
            QueueLink.listeners[key].forEach(listener => {
                listener.callback(entry);
            });
        }

        this.triggerChangeListeners();
    }

    private triggerChangeListeners() {
        const key = QueueLink.key('', 'change');
        if (key in QueueLink.listeners) {
            QueueLink.listeners[key].forEach(listener => {
                listener.callback(this.opQueue);
            });
        }
    }
}
