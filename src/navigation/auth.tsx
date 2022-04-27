import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from 'screens/Login';
import SignUp from 'screens/SignUp';
import ForgotPassword from 'screens/ForgotPassword';
import VerifyEmail from 'screens/VerifyEmail';
import ChangePassword from 'screens/ChangePassword';
import OnBoarding from 'screens/OnBoarding';

import {BackButton} from 'components/HeaderButton';

import COLORS from 'utils/colors';
import {_} from 'services/i18n';

export type AuthStackParamList = {
    Login: undefined;
    OnBoarding: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    VerifyEmail: undefined;
    ChangePassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="OnBoarding"
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
                name="OnBoarding"
                component={OnBoarding}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{headerTitle: _('Log in')}}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{headerTitle: _('Create an account')}}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{headerTitle: _('Forgot password?')}}
            />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    );
}
