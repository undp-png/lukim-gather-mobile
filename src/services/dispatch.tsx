import {store} from 'store';
import {gql, useQuery} from '@apollo/client';

import {
    setLogin,
    setUser,
    setToken,
    setRefreshToken,
    setLogout,
} from 'store/slices/auth';

const {dispatch} = store;

export const dispatchLogin = async (accessToken, refreshToken, user) => {
    dispatch(setToken(accessToken));
    setRefreshToken(refreshToken);
    dispatch(setUser(user));
    dispatch(setLogin());
};

export const dispatchLogout = async () => {
    dispatch(setLogout());
};
