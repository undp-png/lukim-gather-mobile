import {StackParamList} from './index';
import {TabParamList} from './tab';
import {AuthStackParamList} from './auth';

declare global {
    namespace ReactNavigation {
        interface RootParamList
            extends StackParamList,
                AuthStackParamList,
                TabParamList {}
    }
}
