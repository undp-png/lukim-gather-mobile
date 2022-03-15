import 'react-native-gesture-handler';

import React, {useMemo} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {BASE_URL} from '@env';

import AppNavigator from 'navigation';

import {store, persistor} from 'store';

import SyncLocaleStore from 'components/SyncLocaleStore';
import LocalizeProvider from '@rna/components/I18n';
import {languages, translations} from 'services/i18n';

import COLORS from 'utils/colors';

import 'services/bootstrap';

const client = new ApolloClient({
    uri: BASE_URL,
    cache: new InMemoryCache(),
});

const App = () => {
    const initialLang = useMemo(() => 'en', []);
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <LocalizeProvider
                        translations={translations}
                        languages={languages}
                        defaultLanguage={initialLang}>
                        <SyncLocaleStore>
                            <StatusBar
                                barStyle="dark-content"
                                translucent
                                backgroundColor="transparent"
                            />
                            <NavigationContainer
                                theme={{
                                    colors: {background: COLORS.background},
                                }}>
                                <AppNavigator />
                            </NavigationContainer>
                        </SyncLocaleStore>
                    </LocalizeProvider>
                </PersistGate>
            </Provider>
        </ApolloProvider>
    );
};

export default App;
