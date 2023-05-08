import {useCallback, useState, useEffect} from 'react';

import {useNetInfo} from '@react-native-community/netinfo';
import {
    useApolloClient,
    type DocumentNode,
    type QueryHookOptions,
    type OperationVariables,
} from '@apollo/client';

function useQuery<TData = any, TVariables = OperationVariables>(
    query: DocumentNode,
    options: Omit<QueryHookOptions<TData, TVariables>, 'query'> = {},
    controlled?: boolean,
) {
    const netInfo = useNetInfo();
    const client = useApolloClient();

    const [data, setData] = useState<TData | null>(null);
    const [loading, setLoading] = useState(controlled ? false : true);
    const [error, setError] = useState<any>(null);

    const fetchQuery = useCallback(
        async (fetchOptions = {}) => {
            setLoading(true);
            try {
                const {data: resData, error: resError} = await client.query({
                    query,
                    context: {__skipErrorAccordingCache__: true},
                    ...options,
                    ...fetchOptions,
                    fetchPolicy: netInfo.isInternetReachable
                        ? 'network-only'
                        : 'cache-first',
                });
                setData(resData);
                setError(resError);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [client, netInfo],
    );

    useEffect(() => {
        if (!controlled) {
            fetchQuery();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controlled]);

    return {loading, data, error, refetch: fetchQuery};
}

export default useQuery;
