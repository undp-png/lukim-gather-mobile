import {store} from 'store';

import {
    setLogin,
    setUser,
    setToken,
    setRefreshToken,
    setLogout,
} from 'store/slices/auth';
import {setLanguages} from 'store/slices/locale';

const {dispatch} = store;

export const dispatchLogin = async (accessToken, refreshToken, user) => {
    dispatch(setToken(accessToken));
    setRefreshToken(refreshToken);
    dispatch(setUser(user));
    dispatch(setLogin());
};

export const dispatchLogout = () => {
    dispatch(setLogout());
};

export const dispatchLocale = code => {
    dispatch(setLanguages(code));
};
