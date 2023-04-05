import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {GET_ME} from 'services/gql/queries';
import {setUser} from 'store/slices/auth';

import useQuery from './useQuery';

const useGetUser = () => {
    const dispatch = useDispatch();

    const {refetch: getUserData, data} = useQuery(GET_ME, {}, true);

    useEffect(() => {
        if (data?.me) {
            dispatch(setUser(data.me));
        }
    }, [data, dispatch]);

    return getUserData;
};

export default useGetUser;
