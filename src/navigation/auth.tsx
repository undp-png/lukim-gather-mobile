import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from 'screens/Login';
import SignUp from 'screens/SignUp';
import ForgotPassword from 'screens/ForgotPassword';
import VerifyEmail from 'screens/VerifyEmail';
import ChangePassword from 'screens/ChangePassword';

import {BackButton} from 'components/HeaderButton';

import COLORS from 'utils/colors';

type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    VerifyEmail: undefined;
    ChangePassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator(props) {
    return (
        <Stack.Navigator
            initialRoutename="Login"
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
                name="Login"
                component={Login}
                options={{headerTitle: 'Log in'}}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{headerTitle: 'Create an account'}}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{headerTitle: 'Forgot password?'}}
            />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    );
}
