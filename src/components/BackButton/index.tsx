import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import COLORS from 'utils/colors';

import styles from './styles';

const BackButton = () => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <TouchableOpacity onPress={onBackPress} style={styles.backIcon}>
            <Icon
                name="arrow-ios-back-outline"
                height={20}
                width={20}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export default BackButton;
