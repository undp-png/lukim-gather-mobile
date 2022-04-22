import React, {useCallback, useState, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-eva-icons';

import Localize from '@rna/components/I18n';

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
    } = props;

    const navigation = useNavigation();
    const showError = useMemo(() => touched && !!error, [touched, error]);

    const handleLocationClick = useCallback(() => {
        navigation.navigate('ChangeLocation', {onChange});
    }, [navigation, onChange]);

    const handleClearPress = useCallback(() => {
        onChange(null);
    }, [onChange]);

    return (
        <View style={fieldContainerStyle}>
            <Text style={styles.title}>{title}</Text>
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
                        {value
                            ? value?.polygon
                                ? 'Polygon'
                                : `${value?.point}`
                            : 'Choose the location'}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleLocationClick}>
                    <Text style={styles.change}>Change</Text>
                </TouchableOpacity>
            </View>
            {!!value && (
                <Text style={styles.clearText} onPress={handleClearPress}>
                    <Localize>Clear</Localize>
                </Text>
            )}
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && !value && showRequired && (
                <Text style={styles.warningText}>Required</Text>
            )}
        </View>
    );
};

export default LocationInput;
