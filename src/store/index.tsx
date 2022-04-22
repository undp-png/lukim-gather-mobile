import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

import {reduxStorage} from './storage';
import rootReducer from './rootReducer';

const middlewares = [];

if (__DEV__) {
    const {logger} = require('redux-logger');
    middlewares.push(logger);
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
}

const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    whitelist: ['auth', 'form'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    devTools: __DEV__,
    middleware: [
        ...getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
        ...middlewares,
    ],
});
const persistor = persistStore(store);

export {store, persistor};
