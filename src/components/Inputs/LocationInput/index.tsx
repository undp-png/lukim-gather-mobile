import React, {useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Localize from '@rna/components/I18n';
import {_} from 'services/i18n';

import cs from '@rna/utils/cs';

import {InputProps} from '../index';
import styles from './styles';

const LocationInput: React.FC<InputProps> = (props: InputProps) => {
    const {
        title,
        showRequired,
        input: {onChange, value},
        meta: {error, warning, touched},
        fieldContainerStyle,
        inputProps: {hints, editable},
    } = props;

    const navigation = useNavigation();
    const showError = useMemo(() => touched && !!error, [touched, error]);

    const parsedValue = useMemo(() => {
        if (value) {
            const valueGeometry = JSON.parse(value);
            return {point: valueGeometry.coordinates};
        }
        return '';
    }, [value]);

    const handleChange = useCallback(
        val => {
            if (val?.point?.length) {
                const newValue = {type: 'Point', coordinates: val.point};
                return onChange && onChange(JSON.stringify(newValue));
            }
            onChange(null);
        },
        [onChange],
    );

    const handleLocationClick = useCallback(() => {
        navigation.navigate('ChangeLocation', {
            onChange: handleChange,
            polygonDisabled: true,
        });
    }, [navigation, handleChange]);

    const handleClearPress = useCallback(() => {
        if (!editable) {
            return;
        }
        onChange(null);
    }, [onChange, editable]);

    return (
        <View style={fieldContainerStyle}>
            <Text style={styles.title}>{title}</Text>
            {!!hints && <Text style={styles.hints}>{hints}</Text>}
            <View style={styles.locationCont}>
                <View
                    style={cs(
                        styles.locationWrapper,
                        [
                            styles.inputWarning,
                            !!warning || (!showError && !value && showRequired),
                        ],
                        [styles.inputError, showError],
                    )}>
                    <Icon name="pin" height={20} width={20} fill={'#80A8C5'} />
                    <Text style={styles.countyName}>
                        {parsedValue
                            ? `${parsedValue?.point}`
                            : _('Choose the location')}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleLocationClick}
                    disabled={!editable}>
                    <Text style={styles.change}>
                        <Localize>Change</Localize>
                    </Text>
                </TouchableOpacity>
            </View>
            {!!value && (
                <Text style={styles.clearText} onPress={handleClearPress}>
                    <Localize>Clear</Localize>
                </Text>
            )}
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && !value && showRequired && (
                <Text style={styles.warningText}>
                    <Localize>Required</Localize>
                </Text>
            )}
        </View>
    );
};

export default LocationInput;
