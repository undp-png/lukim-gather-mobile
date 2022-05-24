import React, {useCallback, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
    Animated,
    FlatList,
    ImageBackground,
    useWindowDimensions,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

import Text from 'components/Text';
import Button from 'components/Button';
import content from 'services/data/onBoarding.json';

import {useI18nContext, Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';
import cs from '@rna/utils/cs';

import backgroundImage from 'assets/images/onboarding.png';
import styles from './styles';

const keyExtractor = (item: {title: string}) => item.title;

const OnBoarding = () => {
    const navigation = useNavigation();
    const {width} = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;

    const {selectedLanguage} = useI18nContext();

    const handleLogin = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const handleGetStarted = useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    const netInfo = useNetInfo();

    const handleGuestPress = useCallback(() => {
        navigation.navigate('Feed');
    }, [navigation]);

    const Pagination = useCallback(() => {
        return (
            <View style={styles.dotsWrapper}>
                {content.map((placeholder, i) => {
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
                    <Text style={styles.contentTitle} title={_(item.title)} />
                    <Text
                        style={styles.contentInfo}
                        title={_(item.description)}
                    />
                </View>
            );
        },
        [],
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={backgroundImage}
                resizeMode="cover"
                style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleWrapper}>
                        <Image source={require('assets/icons/logo.png')} />
                        <View>
                            <Text style={styles.title} title={_('Lukim')} />
                            <Text style={styles.title} title={_('Gather')} />
                        </View>
                    </View>
                    <View>
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
                        <Pagination />
                        <View
                            style={cs(styles.buttonsWrapper, [
                                styles.bottomSpacer,
                                netInfo.isInternetReachable,
                            ])}>
                            <Button
                                title={_('Login', selectedLanguage)}
                                onPress={handleLogin}
                                style={styles.login}
                                light
                            />
                            <Button
                                title={_('Get Started', selectedLanguage)}
                                onPress={handleGetStarted}
                                style={styles.getStarted}
                                blue
                            />
                        </View>
                        {(__DEV__ || !netInfo.isInternetReachable) && (
                            <View style={styles.bottomSpacer}>
                                <TouchableOpacity
                                    style={styles.link}
                                    onPress={handleGuestPress}>
                                    <Text
                                        style={styles.linkText}
                                        title={_(
                                            'Continue as Guest',
                                            selectedLanguage,
                                        )}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default OnBoarding;
