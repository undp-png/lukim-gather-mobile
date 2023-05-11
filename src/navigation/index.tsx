import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStateOrAny, useSelector} from 'react-redux';

import useQuery from 'hooks/useQuery';
import useFCM from 'hooks/useFCM';

import AuthNavigator from './auth';
import TabNavigator from './tab';

import About from 'screens/About';
import AccountSettings from 'screens/AccountSettings';
import EmailSettings from 'screens/EmailSettings';
import Language from 'screens/Language';
import ChangePassword from 'screens/ChangePassword';
import ChangePhone from 'screens/ChangePhone';
import OTPVerify from 'screens/OTPVerify';
import AccountDeletion from 'screens/AccountDeletion';
import ForgotPassword from 'screens/ForgotPassword';
import VerifyEmail from 'screens/VerifyEmail';
import VerifyPhone from 'screens/VerifyPhone';
import CreateNewPassword from 'screens/CreateNewPassword';
import ChangeLocation from 'screens/ChangeLocation';
import SearchCategory from 'screens/SearchCategory';
import UpdateSurvey from 'screens/UpdateSurvey';
import EditSurvey from 'screens/EditSurvey';
import CreateSurvey from 'screens/CreateSurvey';
import ExistingEntries from 'screens/ExistingEntries';
import EditProfile from 'screens/EditProfile';
import Feedbacks from 'screens/Feedbacks';
import Help from 'screens/Help';
import SearchSurvey from 'screens/SearchSurvey';
import Settings from 'screens/Settings';
import SurveyItem from 'screens/SurveyItem';
import Forms from 'screens/Forms';
import Projects from 'screens/Projects';
import TermsAndCondition from 'screens/TermsAndCondition';
import PrivacyPolicy from 'screens/PrivacyPolicy';
import WebViewForm from 'screens/Webviewform';
import Notifications from 'screens/Notification';

import type {FormDataType} from 'screens/WebViewForm';

import {BackButton, CloseButton} from 'components/HeaderButton';

import {GET_LEGAL_DOCUMENT} from 'services/gql/queries';
import {dispatchInfo} from 'services/dispatch';
import type {
    HappeningSurveyType,
    FormType,
    ProtectedAreaCategoryType,
    ProjectType,
} from '@generated/types';
import COLORS from 'utils/colors';
import {_} from 'services/i18n';

export type StackParamList = {
    About: undefined;
    AccountSettings: undefined;
    Language: undefined;
    Auth: {screen: string};
    ChangePassword: undefined;
    EmailSettings: undefined;
    ChangePhone: undefined;
    OTPVerify: {
        onSubmitPin: (pin: string) => void;
        onResendPin: () => void;
        target: string; // Email or Phone number
    };
    ChangeLocation: {
        onChange?: (value: any) => void;
        surveyData?: HappeningSurveyType;
    };
    SearchCategory: undefined;
    CreateSurvey: {
        categoryItem: ProtectedAreaCategoryType;
    };
    ExistingEntries: {
        existingSurveys: HappeningSurveyType[];
    };
    EditSurvey: {
        surveyItem: HappeningSurveyType;
    };
    UpdateSurvey: {
        surveyItem: HappeningSurveyType;
    };
    EditProfile: undefined;
    Feed: {screen: string; params?: {screen: string}};
    Feedback: undefined;
    Home: undefined;
    Settings: undefined;
    ForgotPassword: undefined;
    VerifyEmail: undefined;
    VerifyPhone: {
        phone?: string;
    };
    CreateNewPassword: undefined;
    Help: undefined;
    SearchSurvey: undefined;
    SurveyItem: {item?: HappeningSurveyType};
    Forms: undefined;
    Projects: undefined;
    WebViewForm: {
        form?: FormType;
        data?: FormDataType;
        projects?: ProjectType[];
    };
    TermsAndCondition: undefined;
    PrivacyPolicy: undefined;
    Notifications: {
        onNotificationPress?: () => void;
        unRead?: boolean;
    };
    AccountDeletion: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => {
    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const {currentLanguage} = useSelector(
        (state: RootStateOrAny) => state.locale,
    );
    const {data} = useQuery(GET_LEGAL_DOCUMENT);
    useFCM();

    dispatchInfo(data?.legalDocument);

    return (
        <Stack.Navigator
            key={currentLanguage} // To re-render on any change in locale state
            initialRouteName={isAuthenticated ? 'Feed' : 'Auth'}
            screenOptions={{
                headerLeft: () => <BackButton />,
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'Inter-SemiBold',
                    color: COLORS.tertiary,
                    fontSize: 18,
                    lineHeight: 21.78,
                },
                headerStyle: {
                    backgroundColor: COLORS.white,
                    shadowColor: 'transparent',
                    borderBottomColor: '#cfd5dc',
                    borderBottomWidth: 1,
                },
            }}>
            <Stack.Screen
                options={{headerShown: false}}
                name="Feed"
                component={TabNavigator}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{headerTitle: _('Settings')}}
            />
            <Stack.Screen
                name="AccountSettings"
                component={AccountSettings}
                options={{
                    headerTitle: _('Account Settings'),
                }}
            />
            <Stack.Screen
                name="EmailSettings"
                component={EmailSettings}
                options={{
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="Language"
                component={Language}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Language'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Password'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ChangePhone"
                component={ChangePhone}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Phone Number'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="OTPVerify"
                component={OTPVerify}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: '',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="AccountDeletion"
                component={AccountDeletion}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Delete Account'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{headerTitle: _('Forgot password?')}}
            />
            <Stack.Screen
                name="VerifyEmail"
                component={VerifyEmail}
                options={{headerTitle: _('Verify your email')}}
            />
            <Stack.Screen
                name="VerifyPhone"
                component={VerifyPhone}
                options={{headerTitle: _('Verify your phone')}}
            />
            <Stack.Screen
                name="CreateNewPassword"
                component={CreateNewPassword}
                options={{headerTitle: _('Create new Password')}}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Edit Profile'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="About"
                component={About}
                options={{headerTitle: _('About')}}
            />
            <Stack.Screen
                name="Feedback"
                component={Feedbacks}
                options={{headerTitle: _('Feedback')}}
            />
            <Stack.Screen
                name="Help"
                component={Help}
                options={{headerTitle: _('Help')}}
            />
            <Stack.Screen
                name="TermsAndCondition"
                component={TermsAndCondition}
                options={{
                    headerTitle: _('Terms & Condition'),
                }}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={{
                    headerTitle: _('Privacy Policy'),
                }}
            />
            <Stack.Screen
                name="Projects"
                component={Projects}
                options={{
                    headerTitle: _('My Projects'),
                }}
            />
            <Stack.Screen
                name="CreateSurvey"
                component={CreateSurvey}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Enter details'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ExistingEntries"
                component={ExistingEntries}
                options={{
                    headerLeft: () => <BackButton />,
                    headerTitle: _('Existing entries'),
                    headerStyle: {
                        backgroundColor: COLORS.white,
                        borderBottomWidth: 0,
                    },
                }}
            />
            <Stack.Screen
                name="EditSurvey"
                component={EditSurvey}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Edit Details'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="UpdateSurvey"
                component={UpdateSurvey}
                options={{
                    headerLeft: () => <BackButton />,
                    headerTitle: _('Update details'),
                }}
            />
            <Stack.Screen
                name="ChangeLocation"
                component={ChangeLocation}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Change Location'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="SearchSurvey"
                component={SearchSurvey}
                options={{headerTitle: ''}}
            />
            <Stack.Screen
                name="SurveyItem"
                component={SurveyItem}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Entries'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="SearchCategory"
                component={SearchCategory}
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.white,
                        shadowColor: 'transparent',
                        borderBottomColor: '#f0f3f6',
                        borderBottomWidth: 1,
                    },
                }}
            />
            <Stack.Screen
                name="Auth"
                component={AuthNavigator}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Forms"
                component={Forms}
                options={{headerTitle: _('Forms')}}
            />
            <Stack.Screen
                name="WebViewForm"
                component={WebViewForm}
                options={({route}) => ({
                    headerLeft: () => <CloseButton />,
                    headerTitle: route.params?.form?.title || 'Form',
                    presentation: 'modal',
                    animationEnabled: false,
                    stackAnimation: 'none',
                })}
            />
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{headerTitle: _('Notifications')}}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
