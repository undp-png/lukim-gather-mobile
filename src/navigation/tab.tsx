import React, {useCallback, useEffect, useState} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/client';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
    createStackNavigator,
    type StackNavigationProp,
} from '@react-navigation/stack';

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

import type {FiltersProps} from 'components/Filters';
import type {StackParamList} from './index';

const Tab = createBottomTabNavigator();

export type TabParamList = {
    Menu: undefined;
    Home: undefined;
    ChooseCategory: undefined;
};

export type HomeNavParamList = {
    HomeScreen: {
        filters: {
            projectFilterId?: FiltersProps['activeProjectId'];
            categoryFilterId?: FiltersProps['activeCategoryId'];
        };
    };
    Surveys: {
        filters: {
            projectFilterId?: FiltersProps['activeProjectId'];
            categoryFilterId?: FiltersProps['activeCategoryId'];
        };
    };
};

const Stack = createStackNavigator<HomeNavParamList>();

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
    const {
        auth: {isAuthenticated},
    } = useSelector((state: RootStateOrAny) => state);
    const navigation = useNavigation<StackNavigationProp<StackParamList>>();
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
                                    navigation.navigate('Notifications', {})
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
