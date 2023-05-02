import 'react-native-gesture-handler';
import 'cross-fetch/polyfill';

import React, {useEffect, useState, useCallback} from 'react';
import {StatusBar, Platform, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import {ApolloProvider} from '@apollo/client';
import type {NormalizedCacheObject} from 'apollo-cache-inmemory';
import {QueueLink} from 'vendor/apollo-link-queue-persist';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';

import AppNavigator from 'navigation';

import {store, persistor} from 'store';

import SyncLocaleStore from 'components/SyncLocaleStore';
import LocalizeProvider from '@rna/components/I18n';

import {getApolloClient} from 'services/gql/client';
import {languages, translations} from 'services/i18n';
import COLORS from 'utils/colors';
import {toastConfig} from 'utils/toast';

import 'services/bootstrap';

import {
    HIDE_LOGBOX,
    CODEPUSH_DEPLOYMENT_KEY_IOS,
    CODEPUSH_DEPLOYMENT_KEY_ANDROID,
} from '@env';

if (HIDE_LOGBOX === 'yes') {
    LogBox.ignoreAllLogs();
}

QueueLink.setFilter(['query']);
const queueLink = new QueueLink();

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    deploymentKey:
        Platform.OS === 'android'
            ? CODEPUSH_DEPLOYMENT_KEY_ANDROID
            : CODEPUSH_DEPLOYMENT_KEY_IOS,
};

const App = () => {
    const [initialLang, setInitialLang] = useState('en');
    const [client, setClient] = useState<NormalizedCacheObject>(null);
    const {isInternetReachable} = useNetInfo();

    const initializeApolloClient = useCallback(async () => {
        const apolloClient = await getApolloClient(queueLink);
        setClient(apolloClient);
    }, []);

    useEffect(() => {
        if (isInternetReachable) {
            queueLink.open();
        } else {
            queueLink.close();
        }
    }, [isInternetReachable]);

    useEffect(() => {
        initializeApolloClient();
        SplashScreen.hide();
    }, [initializeApolloClient]);

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
                                        dark: false,
                                        colors: {
                                            background: COLORS.background,
                                            primary: COLORS.primary,
                                            card: COLORS.backgroundLight,
                                            text: COLORS.greyTextDark,
                                            border: COLORS.border,
                                            notification: COLORS.primary,
                                        },
                                    }}>
                                    <AppNavigator />
                                </NavigationContainer>
                                <Toast
                                    config={toastConfig}
                                    position="bottom"
                                    visibilityTime={5000}
                                />
                            </SyncLocaleStore>
                        </LocalizeProvider>
                    </PersistGate>
                </Provider>
            </ApolloProvider>
        )
    );
};

export default codePush(codePushOptions)(App);
