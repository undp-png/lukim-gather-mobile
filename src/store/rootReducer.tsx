import {combineReducers} from 'redux';

import authReducer from 'store/slices/auth';
import localeReducer from 'store/slices/locale';
import surveyReducer from 'store/slices/survey';

const rootReducer = combineReducers({
    auth: authReducer,
    locale: localeReducer,
    survey: surveyReducer,
});

export type rootState = ReturnType<typeof rootReducer>;
export default rootReducer;
