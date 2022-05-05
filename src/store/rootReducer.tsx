import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from 'store/slices/auth';
import localeReducer from 'store/slices/locale';
import surveyReducer from 'store/slices/survey';
import infoReducer from 'store/slices/info';

const rootReducer = combineReducers({
    auth: authReducer,
    locale: localeReducer,
    survey: surveyReducer,
    form: formReducer,
    lukimInfo: infoReducer,
});

export type rootState = ReturnType<typeof rootReducer>;
export default rootReducer;
