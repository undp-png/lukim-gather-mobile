import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from 'screens/Login';
import SignUp from 'screens/SignUp';
import ForgotPassword from 'screens/ForgotPassword';
import VerifyEmail from 'screens/VerifyEmail';
import ChangePassword from 'screens/ChangePassword';

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
                headerTransparent: true,
                headerTitle: false,
                headerTintColor: COLORS.lightAlt,
                headerShown: false,
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    );
}
