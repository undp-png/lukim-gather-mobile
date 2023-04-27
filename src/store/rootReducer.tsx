import {combineReducers} from 'redux';

import authReducer from 'store/slices/auth';
import localeReducer from 'store/slices/locale';
import surveyReducer from 'store/slices/survey';
import infoReducer from 'store/slices/info';
import formReducer from 'store/slices/form';
import notificationReducer from 'store/slices/notification';

const rootReducer = combineReducers({
    auth: authReducer,
    locale: localeReducer,
    survey: surveyReducer,
    form: formReducer,
    lukimInfo: infoReducer,
    notification: notificationReducer,
});

export type rootState = ReturnType<typeof rootReducer>;
export default rootReducer;
