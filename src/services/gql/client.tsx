import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    fromPromise,
} from '@apollo/client';

import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {cacheFirstNetworkErrorLink} from 'apollo-link-network-error';
import SerializingLink from 'apollo-link-serialize';
import {
    persistCache,
    MMKVStorageWrapper as MMKVCacheStorageWrapper,
    PersistentStorage,
} from 'apollo3-cache-persist';
import {
    persistQueue,
    MMKVStorageWrapper as MMKVQueueStorageWrapper,
} from 'vendor/apollo-link-queue-persist';
import {createUploadLink} from 'apollo-upload-client';

import {BASE_URL} from '@env';
import Toast from 'utils/toast';
import {_} from 'services/i18n';

import {store} from 'store';
import {cacheStorage, queueStorage} from 'store/storage';
import {setToken, setRefreshToken} from 'store/slices/auth';

import MediaLink from './MediaLink';
import {REFRESH_TOKEN} from './queries';

const {dispatch} = store;

const identity = (arg: any) => arg;

export const getApolloClient = async (queueLink: any) => {
    const cache = new InMemoryCache();
    const serializeLink = new SerializingLink();
    const httpLink = createUploadLink({
        uri: BASE_URL,
    });

    let isRefreshing = false;
    let pendingRequests: any = [];

    const resolvePendingRequests = () => {
        pendingRequests.map((callback: any) => callback());
        pendingRequests = [];
    };

    const errorIgnoreLink = cacheFirstNetworkErrorLink(cache);

    const errorLink = onError(({graphQLErrors, operation, forward}) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                const {
                    auth: {refreshToken},
                } = store.getState();
                if (
                    err?.message?.toLowerCase() ===
                        'error decoding signature' &&
                    refreshToken
                ) {
                    let _forward;
                    if (!isRefreshing) {
                        isRefreshing = true;
                        _forward = fromPromise(
                            client
                                .mutate({
                                    mutation: REFRESH_TOKEN,
                                    variables: {
                                        refreshToken: refreshToken,
                                    },
                                })
                                .then(({data: {refreshToken: refToken}}) => {
                                    if (refToken) {
                                        dispatch(setToken(refToken.token));
                                        dispatch(
                                            setRefreshToken(
                                                refToken.refreshToken,
                                            ),
                                        );
                                    }
                                    return true;
                                })
                                .then(() => {
                                    resolvePendingRequests();
                                    return true;
                                })
                                .catch(() => {
                                    pendingRequests = [];
                                    return false;
                                })
                                .finally(() => {
                                    isRefreshing = false;
                                }),
                        );
                    } else {
                        _forward = fromPromise(
                            new Promise(resolve => {
                                pendingRequests.push(resolve);
                            }),
                        );
                    }
                    return _forward.flatMap(() => forward(operation));
                } else {
                    console.log(
                        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`,
                    );
                }
            }
        }
    });

    const authLink = setContext((operation, {headers}) => {
        const {
            auth: {token},
        } = store.getState();

        if (operation.operationName === 'RefreshToken') {
            return headers;
        }
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    await persistCache({
        cache: cache,
        storage: new MMKVCacheStorageWrapper(cacheStorage),
        debug: __DEV__,
        trigger: 'background',
    });

    const client = new ApolloClient({cache});

    const mediaLink = new MediaLink(client);

    const link = ApolloLink.from([
        queueLink,
        errorLink,
        errorIgnoreLink,
        authLink,
        serializeLink,
        mediaLink,
        httpLink,
    ]);
    client.setLink(link);

    await persistQueue({
        queueLink,
        storage: new MMKVQueueStorageWrapper(queueStorage) as PersistentStorage<
            string | null
        >,
        client,
        debug: __DEV__,
        beforeRestore: identity,
        onCompleted: showCompletedToast,
        onError: console.log,
    });

    return client;
};

function showCompletedToast(request: any, response: any) {
    let messageDescription = '';
    switch (request?.operationName) {
        case 'CreateHappeningSurvey': {
            if (response?.data?.createHappeningSurvey) {
                messageDescription = _('Survey created successfully!');
            }
            break;
        }
        case 'EditHappeningSurvey': {
            if (response?.data?.createHappeningSurvey) {
                messageDescription = _('Survey edited successfully!');
            }
            break;
        }
        case 'DeleteHappeningSurvey': {
            if (response?.data?.deleteHappeningSurvey) {
                messageDescription = _('Survey deleted successfully!');
            }
            break;
        }
        default: {
        }
    }
    Toast.show(_('Online synchronization successful!'), {
        text2:
            messageDescription ||
            _('You may need to refresh some screens to get up-to-date data!'),
    });
}
