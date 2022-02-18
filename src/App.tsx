import 'react-native-gesture-handler';

import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import AppNavigator from 'navigation';

import {store, persistor} from 'store';

import COLORS from 'utils/colors';

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <StatusBar
                    barStyle="light-content"
                    translucent
                    backgroundColor="transparent"
                />
                <NavigationContainer
                    theme={{colors: {background: COLORS.background}}}>
                    <AppNavigator />
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
};

export default App;
