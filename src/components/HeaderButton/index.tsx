import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import COLORS from 'utils/colors';

import styles from './styles';

export const BackButton = () => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <TouchableOpacity onPress={onBackPress} style={styles.closeIcon}>
            <Icon
                name="arrow-ios-back-outline"
                height={20}
                width={20}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export const CloseButton = () => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <TouchableOpacity onPress={onBackPress} style={styles.closeIcon}>
            <Icon
                name="close-circle-outline"
                height={20}
                width={20}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export const SaveButton = ({onSavePress}: {onSavePress(): void}) => {
    return (
        <TouchableOpacity onPress={onSavePress} style={styles.saveIcon}>
            <Icon
                name="checkmark-circle-2"
                height={20}
                width={20}
                fill={'#6DE58C'}
            />
        </TouchableOpacity>
    );
};

export const OptionIcon = ({onOptionPress}: {onOptionPress(): void}) => {
    return (
        <TouchableOpacity onPress={onOptionPress} style={styles.saveIcon}>
            <Icon
                name="more-horizontal-outline"
                height={20}
                width={20}
                fill={'#000'}
            />
        </TouchableOpacity>
    );
};
