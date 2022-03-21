import React, {useCallback, useRef} from 'react';
import {
    Animated,
    FlatList,
    ImageBackground,
    SafeAreaView,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

import Button from 'components/Button';
import content from 'services/data/onBoarding.json';

import waterfall from 'assets/images/waterfall.webp';

import styles from './styles';

const keyExtractor = (item: {title: string}) => item.title;

const OnBoarding = () => {
    const {width} = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;

    const Pagination = useCallback(() => {
        return (
            <View style={styles.dotsWrapper}>
                {content.map((_, i) => {
                    const inputRange = [
                        (i - 1) * width,
                        i * width,
                        (i + 1) * width,
                    ];
                    const outputRange = [0.3, 1, 0.3];
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange,
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View
                            style={[styles.dot, {opacity}]}
                            key={i.toString()}
                        />
                    );
                })}
            </View>
        );
    }, [scrollX, width]);

    const renderItem = useCallback(
        ({item}: {item: {title: string; description: string}}) => {
            return (
                <View style={styles.contentWrapper}>
                    <Text style={styles.contentTitle}>{item.title}</Text>
                    <Text style={styles.contentInfo}>{item.description}</Text>
                </View>
            );
        },
        [],
    );

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={waterfall}
                resizeMode="cover"
                style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>Lukim Gather</Text>
                    </View>
                    <View style={styles.flatListWrapper}>
                        <FlatList
                            horizontal
                            pagingEnabled
                            bounces={false}
                            data={content}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            showsHorizontalScrollIndicator={false}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                                {useNativeDriver: false},
                            )}
                            scrollEventThrottle={32}
                        />
                    </View>
                    <Pagination />
                    <View style={styles.buttonsWrapper}>
                        <Button title="Login" style={styles.login} light />
                        <Button title="Get Started" style={styles.getStarted} />
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default OnBoarding;
