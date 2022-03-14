import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TabBar from 'components/TabBar';

import Menu from 'screens/Menu';
import Home from 'screens/Home';
import Survey from 'screens/Survey';

import {BackButton} from 'components/HeaderButton';

import COLORS from 'utils/colors';

import styles from './styles';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            tabBar={tabBarProps => (
                <TabBar
                    {...tabBarProps}
                    activeColor={COLORS.black}
                    inActiveColor={COLORS.grey}
                    style={styles.tabBar}
                />
            )}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Survey" component={Survey} />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    headerLeft: () => <BackButton />,
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontFamily: 'Inter-SemiBold',
                        color: COLORS.tertiary,
                        fontSize: 18,
                        lineHeight: 21.78,
                    },
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
