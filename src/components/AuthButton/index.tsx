import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import styles from './styles';

interface Props {
    title: string;
    style?: object;
    onPress(): void;
    [key: string]: any;
}

const AuthButton: React.FC<Props> = ({
    title,
    style,
    onPress,
    ...buttonProps
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style]}
            {...buttonProps}>
            <Text style={styles.buttonTitle}>{title}</Text>
        </TouchableOpacity>
    );
};

export default AuthButton;
