import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TabNavigator from './tab';

type StackParamList = {
    Home: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Feed'}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Feed" component={TabNavigator} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
