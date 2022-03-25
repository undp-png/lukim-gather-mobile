import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TabBar from 'components/TabBar';

import Menu from 'screens/Menu';
import Home from 'screens/Home';
import Surveys from 'screens/Surveys';

import {BackButton} from 'components/HeaderButton';

import COLORS from 'utils/colors';

import styles from './styles';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
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
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen
                name="Surveys"
                component={Surveys}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                }}
            />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    headerLeft: () => <BackButton />,
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
