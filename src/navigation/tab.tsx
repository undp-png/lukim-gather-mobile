import React, {useCallback, useState} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/client';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import TabBar from 'components/TabBar';

import Menu from 'screens/Menu';
import Home from 'screens/Home';
import Surveys from 'screens/Surveys';
import ChooseCategory from 'screens/ChooseCategory';

import {_} from 'services/i18n';

import {BackButton} from 'components/HeaderButton';
import {NotificationIcon} from 'components/HeaderButton';

import COLORS from 'utils/colors';
import {GET_NOTIFICATIONS_UNREAD_COUNT} from 'services/gql/queries';

import styles from './styles';

const Tab = createBottomTabNavigator();

export type TabParamList = {
    Surveys: undefined;
    Menu: undefined;
    HomeScreen: undefined;
    ChooseCategory: undefined;
};

const Stack = createStackNavigator<TabParamList>();

function HomeNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={Home} />
            <Stack.Screen
                name="Surveys"
                component={Surveys}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

export default function TabNavigator() {
    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const navigation = useNavigation();
    const [getUnreadCount] = useLazyQuery(GET_NOTIFICATIONS_UNREAD_COUNT, {
        fetchPolicy: 'network-only',
    });
    const [unRead, setUnRead] = useState<boolean>(false);

    const handleRefresh = useCallback(() => {
        getUnreadCount().then(({data}) =>
            setUnRead(data?.notificationUnreadCount > 0),
        );
    }, [getUnreadCount]);
    useFocusEffect(handleRefresh);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                headerTitleStyle: {
                    fontFamily: 'Inter-SemiBold',
                    color: COLORS.tertiary,
                    fontSize: 18,
                    lineHeight: 21.78,
                },
            }}
            tabBar={tabBarProps => (
                <TabBar
                    {...tabBarProps}
                    activeColor={COLORS.blueTextAlt}
                    inActiveColor={COLORS.primaryLight}
                    style={styles.tabBar}
                />
            )}>
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen
                name="ChooseCategory"
                component={ChooseCategory}
                options={{
                    headerLeft: () => <BackButton />,
                    headerShown: true,
                    headerTitle: _('Choose Category'),
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: COLORS.white,
                        shadowColor: 'transparent',
                        borderBottomColor: '#cfd5dc',
                        borderBottomWidth: 1,
                    },
                }}
            />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    title: _('Menu'),
                    headerLeft: () => <BackButton />,
                    headerRight: () =>
                        isAuthenticated && (
                            <NotificationIcon
                                onNotificationPress={() =>
                                    navigation.navigate('Notifications')
                                }
                                unRead={unRead}
                            />
                        ),
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: COLORS.white,
                        shadowColor: 'transparent',
                        borderBottomColor: '#cfd5dc',
                        borderBottomWidth: 1,
                    },
                }}
            />
        </Tab.Navigator>
    );
}
