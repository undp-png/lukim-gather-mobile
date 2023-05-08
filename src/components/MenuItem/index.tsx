import React, {useCallback} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import styles from './styles';

const ForwardIcon = () => {
    return (
        <Icon
            name="arrow-ios-forward-outline"
            height={18}
            width={18}
            fill={'#9fa3a9'}
        />
    );
};

const MenuItem = ({
    title,
    linkTo,
    onPress,
    label,
    params,
    hideForwardIcon = false,
}: {
    title: string;
    linkTo?: any;
    onPress?(): void;
    label?: string;
    params?: object;
    hideForwardIcon?: boolean;
}) => {
    const navigation = useNavigation();
    const onPressMenu = useCallback(
        () => navigation.navigate(linkTo, params),
        [linkTo, navigation, params],
    );
    return (
        <TouchableOpacity
            onPress={linkTo ? onPressMenu : onPress}
            style={styles.menuItem}>
            <Text style={styles.menuTitle} title={title} />
            <View style={styles.labelWrapper}>
                <Text style={styles.label} title={label} />
                {!hideForwardIcon && <ForwardIcon />}
            </View>
        </TouchableOpacity>
    );
};

export default MenuItem;
