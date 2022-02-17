import 'react-native-gesture-handler';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AppNavigator from 'navigation';

import COLORS from 'utils/colors';

const App = () => {
    return (
        <NavigationContainer theme={{colors: {background: COLORS.background}}}>
            <AppNavigator />
        </NavigationContainer>
    );
};

export default App;
