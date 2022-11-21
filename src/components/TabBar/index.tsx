import React, {useMemo} from 'react';
import {View, useWindowDimensions, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
    Defs,
    Path,
    LinearGradient as SVGLinearGradient,
    Stop,
} from 'react-native-svg';
import * as shape from 'd3-shape';

import Text from 'components/Text';

import {_} from 'services/i18n';

import cs from '@rna/utils/cs';
import COLORS from 'utils/colors';

import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import styles from './styles';

const height = 64;

const getIconName = (name: string, isFocused: boolean) => {
    if (isFocused) {
        return name;
    }
    return `${name}-outline`;
};

const TabBar = ({
    state,
    descriptors,
    navigation,
    activeColor,
    inActiveColor,
}: BottomTabBarProps & {
    activeColor: string;
    inActiveColor: string;
}) => {
    const {width} = useWindowDimensions();
    const tabWidth = width / 5;

    const leftTabBar = useMemo(
        () =>
            shape
                .line()
                .x(d => d[0])
                .y(d => d[1])([
                [0, 0],
                [2 * tabWidth, 0],
            ]),
        [tabWidth],
    );

    const centerTabBar = useMemo(
        () =>
            shape
                .line()
                .x(d => d[0])
                .y(d => d[1])
                .curve(shape.curveBundle)([
                [1.75 * tabWidth - 10, 0],
                [1.9 * tabWidth, 0],
                [2 * tabWidth, 7],
                [2.1 * tabWidth, 24],
                [2.15 * tabWidth, 32],
                [2.25 * tabWidth, 40],
                [2.35 * tabWidth, 45],
                [2.45 * tabWidth, 47],
                [2.55 * tabWidth, 47],
                [2.65 * tabWidth, 45],
                [2.75 * tabWidth, 40],
                [2.85 * tabWidth, 32],
                [2.9 * tabWidth, 24],
                [3 * tabWidth, 7],
                [3.1 * tabWidth, 0],
                [3.25 * tabWidth + 10, 0],
            ]),
        [tabWidth],
    );

    const rightTabBar = useMemo(
        () =>
            shape
                .line()
                .x(d => d[0])
                .y(d => d[1])([
                [3 * tabWidth, 0],
                [width, 0],
                [width, height],
                [0, height],
                [0, 0],
            ]),
        [tabWidth, width],
    );

    const shadowPath = useMemo(
        () =>
            shape
                .line()
                .x(d => d[0])
                .y(d => d[1])([
                [0, 0],
                [width, 0],
                [width, height],
                [0, height],
                [0, 0],
            ]),
        [width],
    );

    return (
        <View
            style={cs(
                styles.safeArea,
                [
                    styles.containerHidden,
                    state.index !==
                        state.routes.findIndex(rt => rt.name === 'Home'),
                ],
                {width},
            )}>
            {state.index ===
                state.routes.findIndex(
                    (rt: {name: string}) => rt.name === 'Home',
                ) && (
                <>
                    <Svg
                        style={styles.shadowContainer}
                        height={height}
                        width={width}>
                        <Defs>
                            <SVGLinearGradient
                                id="shadowBlock"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <Stop
                                    offset="1"
                                    stopColor="black"
                                    stopOpacity="0.08"
                                />
                                <Stop
                                    offset="0.3"
                                    stopColor="black"
                                    stopOpacity="0.06"
                                />
                                <Stop
                                    offset="0.15"
                                    stopColor="black"
                                    stopOpacity="0.04"
                                />
                                <Stop
                                    offset="0"
                                    stopColor="black"
                                    stopOpacity="0"
                                />
                            </SVGLinearGradient>
                        </Defs>
                        <Path d={`${shadowPath}`} fill="url(#shadowBlock)" />
                    </Svg>
                    <Svg height={height} width={width}>
                        <Path
                            d={`${leftTabBar} ${centerTabBar} ${rightTabBar}`}
                            fill={COLORS.white}
                        />
                    </Svg>
                </>
            )}
            <View style={styles.container}>
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
                        case 'ChooseCategory':
                            iconName = getIconName('plus', isFocused);
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
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const onPlusPress = () => {
                        navigation.navigate('ChooseCategory');
                    };

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={
                                isFocused ? {selected: true} : {}
                            }
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            testID={options.tabBarTestID}
                            onPress={
                                route.name === 'ChooseCategory'
                                    ? onPlusPress
                                    : onPress
                            }
                            onLongPress={onLongPress}
                            style={styles.tabBar}
                            activeOpacity={0.7}
                            key={route.key}>
                            {route.name === 'ChooseCategory' ? (
                                <LinearGradient
                                    colors={['#2A86EB', '#054FA0']}
                                    locations={[0.15, 0.85]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={styles.plusButton}>
                                    <Icon
                                        name={iconName}
                                        fill={COLORS.white}
                                        height={28}
                                        width={28}
                                    />
                                </LinearGradient>
                            ) : (
                                <View style={styles.iconWrapper}>
                                    <Icon
                                        name={iconName}
                                        fill={
                                            isFocused
                                                ? activeColor
                                                : inActiveColor
                                        }
                                        height={25}
                                        width={25}
                                    />
                                    <Text
                                        style={cs(styles.title, {
                                            color: isFocused
                                                ? activeColor
                                                : inActiveColor,
                                        })}
                                        title={_(route.name)}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default TabBar;
