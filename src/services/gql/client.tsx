import {ApolloClient, ApolloLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {
    persistCache,
    MMKVStorageWrapper as MMKVCacheStorageWrapper,
} from 'apollo3-cache-persist';
import {
    persistQueue,
    MMKVStorageWrapper as MMKVQueueStorageWrapper,
} from 'apollo-link-queue-persist';
import {createUploadLink} from 'apollo-upload-client';

import {BASE_URL} from '@env';

import {reduxStorage, queueStorage} from 'store/storage';

export const getApolloClient = async (token, queueLink) => {
    const cache = new InMemoryCache();
    const httpLink = createUploadLink({
        uri: BASE_URL,
    });

    const authLink = setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                authorization: token ? `JWT ${token}` : '',
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
    });

    return client;
};
