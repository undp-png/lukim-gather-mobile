import React, {useCallback} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import cs from 'vendor/react-native-arsenal/lib/utils/cs';

import styles from './styles';

interface Props {
    label: string;
    selected: boolean;
    onPress(label: string): void;
    contentContainerStyle: object;
}

const RadioInput: React.FC<Props> = ({
    label,
    selected,
    onPress,
    contentContainerStyle,
}) => {
    const handlePress = useCallback(() => {
        onPress(label);
    }, [label, onPress]);

    return (
        <TouchableOpacity
            style={cs(styles.container, contentContainerStyle)}
            onPress={handlePress}>
            <TouchableOpacity onPress={handlePress}>
                <Icon
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    height={25}
                    width={25}
                    fill={selected ? '#196297' : '#B3CBDC'}
                />
            </TouchableOpacity>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

export default RadioInput;
