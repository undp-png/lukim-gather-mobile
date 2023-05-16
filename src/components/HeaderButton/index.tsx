import React, {useCallback} from 'react';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import COLORS from 'utils/colors';

import styles from './styles';

export const BackButton = () => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <TouchableOpacity onPress={onBackPress} style={styles.headerIcon}>
            <Icon
                name="arrow-ios-back-outline"
                height={30}
                width={30}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export const CloseButton = ({onClose}: {onClose?: () => void}) => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <TouchableOpacity
            onPress={onClose || onBackPress}
            style={styles.headerIcon}>
            <Icon
                name="close-outline"
                height={30}
                width={30}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export const SaveButton = ({onSavePress}: {onSavePress(): void}) => {
    return (
        <TouchableOpacity onPress={onSavePress} style={styles.headerIcon}>
            <Icon
                name="checkmark-circle-2"
                height={30}
                width={30}
                fill={COLORS.accent}
            />
        </TouchableOpacity>
    );
};

export const OptionIcon = ({onOptionPress}: {onOptionPress(): void}) => {
    return (
        <TouchableOpacity onPress={onOptionPress} style={styles.headerIcon}>
            <Icon
                name="more-horizontal-outline"
                height={30}
                width={30}
                fill={'#000'}
            />
        </TouchableOpacity>
    );
};

export const SearchIcon = ({onSearchPress}: {onSearchPress(): void}) => {
    return (
        <TouchableOpacity onPress={onSearchPress} style={styles.headerIcon}>
            <Icon
                name="search-outline"
                height={30}
                width={30}
                fill={COLORS.greyTextDark}
            />
        </TouchableOpacity>
    );
};

export const NotificationIcon = ({
    onNotificationPress,
    unRead,
}: {
    onNotificationPress(): void;
    unRead: boolean;
}) => {
    return (
        <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.headerIcon}>
            {unRead ? (
                <Image
                    style={styles.notificationIcon}
                    source={require('assets/images/active-notification.png')}
                />
            ) : (
                <Icon
                    name="bell-outline"
                    height={30}
                    width={30}
                    fill={'#101828'}
                />
            )}
        </TouchableOpacity>
    );
};
