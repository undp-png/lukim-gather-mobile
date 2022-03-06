import {combineReducers} from 'redux';

import authReducer from 'store/slices/auth';
import localeReducer from 'store/slices/locale';

const rootReducer = combineReducers({
    auth: authReducer,
    locale: localeReducer,
});

export type rootState = ReturnType<typeof rootReducer>;
export default rootReducer;
