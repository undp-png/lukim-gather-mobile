import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDeviceOrientation} from '@react-native-community/hooks';

import cs from '@rna/utils/cs';

import styles from './styles';

const getIconName = (name, isFocused) => {
    if (isFocused) {
        return name;
    }
    return `${name}-outline`;
};

const TabBar = ({
    state,
    descriptors,
    navigation,
    style,
    activeColor,
    inActiveColor,
}) => {
    const insets = useSafeAreaInsets();

    const {landscape: isLandscape} = useDeviceOrientation();

    return (
        <View
            style={cs(
                style,
                styles.container,
                {
                    height: 64 + insets.bottom,
                    paddingBottom: insets.bottom,
                },
                [
                    styles.containerHidden,
                    isLandscape &&
                        state.index ===
                            state.routes.findIndex(rt => rt.name === 'Home'),
                ],
                [
                    styles.containerHidden,
                    state.index ===
                        state.routes.findIndex(rt => rt.name === 'Menu'),
                ],
            )}>
            {state.routes.map((route, index) => {
                let iconName;

                const {options} = descriptors[route.key];

                const isFocused = state.index === index;

                switch (route.name) {
                    case 'Home':
                        iconName = getIconName('home', isFocused);
                        break;
                    case 'Menu':
                        iconName = getIconName('grid', isFocused);
                        break;
                    default:
                        iconName = getIconName('person', isFocused);
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({type: 'tabLongPress', target: route.key});
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityStates={isFocused ? ['selected'] : []}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabBar}
                        key={route.key}>
                        <Icon
                            name={iconName}
                            fill={isFocused ? activeColor : inActiveColor}
                            height={25}
                            width={25}
                        />
                        <Text
                            style={cs(styles.title, {
                                color: isFocused ? activeColor : inActiveColor,
                            })}>
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default TabBar;
