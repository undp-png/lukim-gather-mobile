import React, {useCallback, useState} from 'react';
import {View, TextInput} from 'react-native';

import Text from 'components/Text';

import cs from '@rna/utils/cs';

import COLORS from 'utils/colors';

import styles from './styles';

const _TextInput = ({label, input, ...otherProps}) => {
    const [focused, setFocused] = useState(false);

    const onFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const onBlur = useCallback(() => {
        setFocused(false);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={cs(styles.label)} title={label} />
            <TextInput
                style={cs(styles.textInput, focused && styles.focusedInput)}
                value={input}
                onFocus={onFocus}
                onBlur={onBlur}
                {...otherProps}
            />
        </View>
    );
};

export default _TextInput;
