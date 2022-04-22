import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';

import InputField from 'components/InputField';

import cs from '@rna/utils/cs';

import {InputProps} from '../index';
import styles from './styles';

const TextInput: React.FC<InputProps> = (props: InputProps) => {
    const {
        input: {onChange, value, ...formProps},
        meta: {touched, error, warning},
        showRequired,
        inputProps,
        inputStyle,
        fieldContainerStyle,
        ...otherProps
    } = props;

    const showError = useMemo(() => touched && !!error, [touched, error]);

    return (
        <View style={fieldContainerStyle}>
            <InputField
                onChangeText={onChange}
                inputStyle={cs(
                    [
                        styles.inputWarning,
                        !!warning || (!showError && !value && showRequired),
                    ],
                    [styles.inputError, showError],
                )}
                value={value}
                {...formProps}
                {...inputProps}
                {...otherProps}
            />
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && !value && showRequired && (
                <Text style={styles.warningText}>Required</Text>
            )}
        </View>
    );
};

export default TextInput;
