import {useCallback, useState, useEffect} from 'react';

import {useNetInfo} from '@react-native-community/netinfo';
import {useApolloClient} from '@apollo/client';

const useQuery = (query, options = {}) => {
    const netInfo = useNetInfo();
    const client = useApolloClient();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuery = useCallback(async () => {
        setLoading(true);
        try {
            const {data: resData, error: resError} = await client.query({
                query,
                fetchPolicy: netInfo.isInternetReachable
                    ? 'network-only'
                    : 'cache-first',
                context: {__skipErrorAccordingCache__: true},
                ...options,
            });
            setData(resData);
            setError(resError);
            setLoading(false);
        } catch (err) {
            setError(err);
            console.log(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, netInfo]);

    useEffect(() => {
        fetchQuery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {loading, data, error, refetch: fetchQuery};
};

export default useQuery;
