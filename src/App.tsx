import 'react-native-gesture-handler';
import 'cross-fetch/polyfill';

import React, {useEffect, useState, useCallback} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {ApolloProvider} from '@apollo/client';
import {NormalizedCacheObject} from 'apollo-cache-inmemory';
import QueueLink from 'apollo-link-queue';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import AppNavigator from 'navigation';

import {store, persistor} from 'store';

import SyncLocaleStore from 'components/SyncLocaleStore';
import LocalizeProvider from '@rna/components/I18n';

import {getApolloClient} from 'services/gql/client';
import {languages, translations} from 'services/i18n';
import COLORS from 'utils/colors';

import 'services/bootstrap';

const queueLink = new QueueLink();

const App = () => {
    const [initialLang, setInitialLang] = useState('en');
    const [client, setClient] = useState<NormalizedCacheObject>(null);
    const {isInternetReachable} = useNetInfo();

    const initializeApolloClient = async () => {
        const {
            auth: {token},
        } = store.getState();
        await getApolloClient(token, queueLink).then(apolloClient => {
            setClient(apolloClient);
        });
    };

    useEffect(() => {
        if (isInternetReachable) {
            queueLink.open();
            console.log('queueLink opened');
        } else {
            queueLink.close();
            console.log('queueLink closed');
        }
    }, [isInternetReachable]);

    useEffect(() => {
        initializeApolloClient();
    }, []);

    const handleInitialize = useCallback(async () => {
        const {
            locale: {currentLanguage},
        } = store.getState();
        setInitialLang(currentLanguage);
    }, []);
    return (
        client && (
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <PersistGate
                        persistor={persistor}
                        onBeforeLift={handleInitialize}>
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
        )
    );
};

export default App;
