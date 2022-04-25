import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import AuthNavigator from './auth';
import TabNavigator from './tab';

import About from 'screens/About';
import AccountSettings from 'screens/AccountSettings';
import Lauguage from 'screens/Language';
import ChangePassword from 'screens/ChangePassword';
import ChangeLocation from 'screens/ChangeLocation';
import ChooseCategory from 'screens/ChooseCategory';
import SearchCategory from 'screens/SearchCategory';
import CreateSurvey from 'screens/CreateSurvey';
import EditProfile from 'screens/EditProfile';
import Feedbacks from 'screens/Feedbacks';
import Help from 'screens/Help';
import SearchSurvey from 'screens/SearchSurvey';
import Settings from 'screens/Settings';
import SurveyItem from 'screens/SurveyItem';
import Forms from 'screens/Forms';
import FillForm from 'screens/FillForm';

import {BackButton, CloseButton} from 'components/HeaderButton';

import COLORS from 'utils/colors';

export type StackParamList = {
    About: undefined;
    AccountSettings: undefined;
    Lauguage: undefined;
    Auth: undefined;
    ChangePassword: undefined;
    ChangeLocation: {onChange?: (value: any) => void};
    ChooseCategory: undefined;
    SearchCategory: undefined;
    CreateSurvey: undefined;
    EditProfile: undefined;
    Feed: undefined;
    Feedback: undefined;
    Home: undefined;
    Settings: undefined;
    Help: undefined;
    SearchSurvey: undefined;
    SurveyItem: undefined;
    Forms: undefined;
    FillForm: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => {
    const {isAuthenticated} = useSelector(state => state.auth);

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
                    headerTitle: 'Account Settings',
                }}
            />
            <Stack.Screen
                name="Lauguage"
                component={Lauguage}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: 'Lauguage',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: 'Change Password',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: 'Edit Profile',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Feedback" component={Feedbacks} />
            <Stack.Screen name="Help" component={Help} />
            <Stack.Screen
                name="CreateSurvey"
                component={CreateSurvey}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: 'Details',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ChangeLocation"
                component={ChangeLocation}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: 'Change Location',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen name="SearchSurvey" component={SearchSurvey} />
            <Stack.Screen
                name="SurveyItem"
                component={SurveyItem}
                options={{
                    headerLeft: () => <CloseButton />,
                    headerTitle: 'Public Entries',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ChooseCategory"
                component={ChooseCategory}
                options={{
                    headerTitle: 'Choose a category',
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
