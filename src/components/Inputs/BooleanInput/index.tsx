import React, {useMemo, useCallback} from 'react';
import {Text, View} from 'react-native';

import {_} from 'services/i18n';

import RadioInput from '@rna/components/forms/RadioInput';
import cs from '@rna/utils/cs';
import COLORS from 'utils/colors';
import {isset} from '@rna/utils';

import {InputProps} from '../index';
import styles from './styles';

const BooleanInput: React.FC<InputProps> = (props: InputProps) => {
    const {
        fieldContainerStyle,
        containerStyle,
        titleStyle,
        title,
        showRequired,
        input: {onChange, value},
        meta: {touched, error, warning},
    } = props;

    const showError = useMemo(() => touched && !!error, [touched, error]);

    const handleYesPress = useCallback(() => onChange(true), [onChange]);
    const handleNoPress = useCallback(() => onChange(false), [onChange]);

    return (
        <View style={cs(fieldContainerStyle, containerStyle)}>
            {!!title && (
                <Text style={cs(styles.title, titleStyle)}>{title}</Text>
            )}
            <View style={styles.input}>
                <RadioInput
                    label={_('Yes')}
                    contentContainerStyle={styles.radioInput}
                    labelStyle={styles.inputText}
                    radioStyle={styles.radioButton}
                    onPress={handleYesPress}
                    selected={value === true}
                    color={COLORS.primary}
                />
                <RadioInput
                    label={_('No')}
                    contentContainerStyle={styles.radioInput}
                    labelStyle={styles.inputText}
                    radioStyle={styles.radioButton}
                    onPress={handleNoPress}
                    selected={value === false}
                    color={COLORS.primary}
                />
            </View>
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && !isset(value) && showRequired && (
                <Text style={styles.warningText}>Required</Text>
            )}
        </View>
    );
};

export default BooleanInput;
