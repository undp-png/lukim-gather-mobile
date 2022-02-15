import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from 'screens/Home';

type StackParamList = {
    Home: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
