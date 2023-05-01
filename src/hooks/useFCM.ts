import {useEffect} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';
import {CREATE_GCM_TOKEN} from 'services/gql/queries';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useApolloClient} from '@apollo/client';

export default () => {
    const {
        auth: {isAuthenticated},
    } = useSelector((state: RootStateOrAny) => state);
    const client = useApolloClient();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        messaging()
            .getToken()
            .then(token => {
                client.mutate({
                    mutation: CREATE_GCM_TOKEN,
                    variables: {
                        input: {
                            registrationId: token,
                        },
                    },
                });
            });
        const unsubscribe = () => {
            messaging().onMessage(async remoteMessage => {
                notifee.requestPermission();
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                });
                await notifee.displayNotification({
                    title: remoteMessage.notification?.title,
                    body: remoteMessage.notification?.body,
                    android: {
                        channelId,
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
            });
            messaging().setBackgroundMessageHandler(async remoteMessage => {
                console.log(
                    'Message handled in the background!',
                    remoteMessage,
                );
            });
        };
        return unsubscribe;
    }, [client, isAuthenticated]);
};
