import {ApolloClient, ApolloLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {
    persistCache,
    MMKVStorageWrapper as MMKVCacheStorageWrapper,
} from 'apollo3-cache-persist';
import {
    persistQueue,
    MMKVStorageWrapper as MMKVQueueStorageWrapper,
} from 'vendor/apollo-link-queue-persist';
import {createUploadLink} from 'apollo-upload-client';

import {BASE_URL} from '@env';

import {store} from 'store';
import {reduxStorage, queueStorage} from 'store/storage';

export const getApolloClient = async queueLink => {
    const cache = new InMemoryCache();
    const httpLink = createUploadLink({
        uri: BASE_URL,
    });

    const authLink = setContext((_, {headers}) => {
        const {
            auth: {token},
        } = store.getState();

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    const link = ApolloLink.from([queueLink, authLink, httpLink]);

    await persistCache({
        cache: cache,
        storage: new MMKVCacheStorageWrapper(reduxStorage),
        debug: __DEV__,
        trigger: 'background',
    });

    const client = new ApolloClient({cache, link});

    await persistQueue({
        queueLink,
        storage: new MMKVQueueStorageWrapper(queueStorage),
        client,
        debug: __DEV__,
    });

    return client;
};
