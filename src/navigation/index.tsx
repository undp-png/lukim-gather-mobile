import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useQuery} from '@apollo/client';

import AuthNavigator from './auth';
import TabNavigator from './tab';

import About from 'screens/About';
import AccountSettings from 'screens/AccountSettings';
import Language from 'screens/Language';
import ChangePassword from 'screens/ChangePassword';
import ChangeLocation from 'screens/ChangeLocation';
import ChooseCategory from 'screens/ChooseCategory';
import SearchCategory from 'screens/SearchCategory';
import EditSurvey from 'screens/EditSurvey';
import CreateSurvey from 'screens/CreateSurvey';
import EditProfile from 'screens/EditProfile';
import Feedbacks from 'screens/Feedbacks';
import Help from 'screens/Help';
import SearchSurvey from 'screens/SearchSurvey';
import Settings from 'screens/Settings';
import SurveyItem from 'screens/SurveyItem';
import Forms from 'screens/Forms';
import FillForm from 'screens/FillForm';
import TermsAndCondition from 'screens/TermsAndCondition';
import PrivacyPolicy from 'screens/PrivacyPolicy';

import {BackButton, CloseButton} from 'components/HeaderButton';

import {GET_LEGAL_DOCUMENT} from 'services/gql/queries';
import {dispatchInfo} from 'services/dispatch';
import type {HappeningSurveyType, FormType} from '@generated/types';
import COLORS from 'utils/colors';
import {_} from 'services/i18n';

export type StackParamList = {
    About: undefined;
    AccountSettings: undefined;
    Language: undefined;
    Auth: undefined;
    ChangePassword: undefined;
    ChangeLocation: {
        onChange?: (value: any) => void;
        polygonDisabled?: boolean;
    };
    ChooseCategory: undefined;
    SearchCategory: undefined;
    CreateSurvey: undefined;
    EditSurvey: undefined;
    EditProfile: undefined;
    Feed: undefined;
    Feedback: undefined;
    Home: undefined;
    Settings: undefined;
    Help: undefined;
    SearchSurvey: undefined;
    SurveyItem: {item?: HappeningSurveyType};
    Forms: undefined;
    FillForm: {form?: FormType; isViewOnlyMode?: boolean};
    TermsAndCondition: undefined;
    PrivacyPolicy: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => {
    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const {loading, error, data} = useQuery(GET_LEGAL_DOCUMENT);

    dispatchInfo(data?.legalDocument);
    return (
        <Stack.Navigator
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
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen
                name="AccountSettings"
                component={AccountSettings}
                options={{
                    headerTitle: _('Account Settings'),
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
                    headerTitle: _('Change Password'),
                    presentation: 'modal',
                }}
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
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Feedback" component={Feedbacks} />
            <Stack.Screen name="Help" component={Help} />
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
                name="CreateSurvey"
                component={CreateSurvey}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: _('Enter details'),
                    presentation: 'modal',
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
                    headerTitle: _('Public Entries'),
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ChooseCategory"
                component={ChooseCategory}
                options={{
                    headerTitle: _('Choose a category'),
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
            <Stack.Screen name="Forms" component={Forms} />
            <Stack.Screen
                name="FillForm"
                component={FillForm}
                options={({route}) => ({
                    headerLeft: () => <CloseButton />,
                    headerTitle: route.params?.form?.title || 'Form',
                    presentation: 'modal',
                })}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
