import {StackParamList} from './index';
import {AuthStackParamList} from './auth';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends StackParamList, AuthStackParamList {}
    }
}
