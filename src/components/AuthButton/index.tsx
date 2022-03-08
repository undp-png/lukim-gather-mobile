import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import styles from './styles';

interface Props {
    title: string;
    style?: object;
    onPress(): void;
}

const AuthButton: React.FC<Props> = ({title, style, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.buttonTitle}>{title}</Text>
        </TouchableOpacity>
    );
};

export default AuthButton;
