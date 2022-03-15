import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TabNavigator from './tab';

import Settings from 'screens/Settings';
import AccountSettings from 'screens/AccountSettings';
import ChangePassword from 'screens/ChangePassword';
import EditProfile from 'screens/EditProfile';
import About from 'screens/About';
import Feedbacks from 'screens/Feedbacks';
import Help from 'screens/Help';
import SearchSurvey from 'screens/SearchSurvey';

import {BackButton, CloseButton} from 'components/HeaderButton';

import COLORS from 'utils/colors';

type StackParamList = {
    Home: undefined;
    Feed: undefined;
    Settings: undefined;
    AccountSettings: undefined;
    ChangePassword: undefined;
    EditProfile: undefined;
    About: undefined;
    Feedbacks: undefined;
    Help: undefined;
    SearchSurvey: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Feed'}
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
            <Stack.Screen name="Feedbacks" component={Feedbacks} />
            <Stack.Screen name="Help" component={Help} />
            <Stack.Screen name="SearchSurvey" component={SearchSurvey} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
