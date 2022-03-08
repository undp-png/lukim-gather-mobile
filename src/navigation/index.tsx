import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TabNavigator from './tab';

import Settings from 'screens/Settings';
import AccountSettings from 'screens/AccountSettings';
import About from 'screens/About';
import Feedbacks from 'screens/Feedbacks';
import Help from 'screens/Help';

import BackButton from 'components/BackButton';

import COLORS from 'utils/colors';

type StackParamList = {
    Home: undefined;
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
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Feedbacks" component={Feedbacks} />
            <Stack.Screen name="Help" component={Help} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
