import React from 'react';
import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import Svg, {
    Defs,
    Path,
    LinearGradient as SVGLinearGradient,
    Stop,
} from 'react-native-svg';
import * as shape from 'd3-shape';

import cs from '@rna/utils/cs';
import COLORS from 'utils/colors';

import styles from './styles';

const {width} = Dimensions.get('window');
const height = 64;
const tabWidth = width / 5;

const leftTabBar = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
    {x: 0, y: 0},
    {x: 2 * tabWidth, y: 0},
]);

const centerTabBar = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveBundle)([
    {x: 1.75 * tabWidth - 10, y: 0},
    {x: 1.85 * tabWidth, y: 1.5},
    {x: 2 * tabWidth, y: 11},
    {x: 2.05 * tabWidth, y: 22},
    {x: 2.15 * tabWidth, y: 32},
    {x: 2.25 * tabWidth, y: 39},
    {x: 2.35 * tabWidth, y: 42},
    {x: 2.45 * tabWidth, y: 44},
    {x: 2.55 * tabWidth, y: 44},
    {x: 2.65 * tabWidth, y: 42},
    {x: 2.75 * tabWidth, y: 39},
    {x: 2.85 * tabWidth, y: 32},
    {x: 2.95 * tabWidth, y: 22},
    {x: 3 * tabWidth + 10, y: 0},
    {x: 3.25 * tabWidth, y: 0},
    {x: 3.5 * tabWidth, y: 0},
]);

const rightTabBar = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
    {x: 3 * tabWidth, y: 0},
    {x: width, y: 0},
    {x: width, y: height},
    {x: 0, y: height},
    {x: 0, y: 0},
]);

const tabBarPath = `${leftTabBar} ${centerTabBar} ${rightTabBar}`;

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
    style,
    activeColor,
    inActiveColor,
}) => {
    return (
        <View
            style={cs(styles.safeArea, [
                styles.containerHidden,
                state.index ===
                    state.routes.findIndex(rt => rt.name === 'Menu'),
            ])}>
            <>
                <Svg height={height / 2} width={width}>
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
                                stopOpacity="0.12"
                            />
                            <Stop
                                offset="0.3"
                                stopColor="black"
                                stopOpacity="0.08"
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
                </Svg>
                {state.index !==
                    state.routes.findIndex(rt => rt.name === 'Menu') && (
                    <Svg height={height} width={width}>
                        <Path d={`${tabBarPath}`} fill={COLORS.white} />
                    </Svg>
                )}
            </>
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
                        case 'Surveys':
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
                                route.name === 'Surveys' ? onPlusPress : onPress
                            }
                            onLongPress={onLongPress}
                            style={styles.tabBar}
                            key={route.key}>
                            {route.name === 'Surveys' ? (
                                <View style={styles.plusButton}>
                                    <Icon
                                        name={iconName}
                                        fill={COLORS.white}
                                        height={25}
                                        width={25}
                                    />
                                </View>
                            ) : (
                                <>
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
                                        })}>
                                        {route.name}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default TabBar;
