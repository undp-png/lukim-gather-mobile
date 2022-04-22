import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from 'store/slices/auth';
import localeReducer from 'store/slices/locale';
import surveyReducer from 'store/slices/survey';

const rootReducer = combineReducers({
    auth: authReducer,
    locale: localeReducer,
    survey: surveyReducer,
    form: formReducer,
});

export type rootState = ReturnType<typeof rootReducer>;
export default rootReducer;
