import React, {useState, useCallback, useMemo} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';

import {InputProps} from '..index';
import styles from './styles';

const DateInput: React.FC<InputProps> = (props: InputProps) => {
    const {
        fieldContainerStyle,
        containerStyle,
        titleStyle,
        title,
        showRequired,
        input: {onChange, value},
        meta: {touched, error, warning},
        inputProps: {hints, editable},
    } = props;

    const showError = useMemo(() => touched && !!error, [touched, error]);

    const [isDatePickerVisible, setDatePickerVisibility] =
        useState<boolean>(false);

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null,
    );

    const showDatePicker = useCallback(() => {
        setDatePickerVisibility(true);
    }, []);

    const hideDatePicker = useCallback(() => {
        setDatePickerVisibility(false);
    }, []);

    const dateString = useMemo(() => {
        return selectedDate?.toISOString()?.slice(0, 10) || '';
    }, [selectedDate]);

    const handleConfirm = useCallback(
        date => {
            hideDatePicker();
            setSelectedDate(date);
            onChange(date.toISOString().slice(0, 10));
        },
        [hideDatePicker, onChange],
    );

    return (
        <View style={cs(fieldContainerStyle, containerStyle)}>
            {!!title && (
                <Text style={cs(styles.title, titleStyle)}>{title}</Text>
            )}
            {!!hints && <Text style={styles.hints}>{hints}</Text>}
            <TouchableOpacity
                style={cs(
                    styles.input,
                    [
                        styles.inputWarning,
                        !!warning || (!showError && !value && showRequired),
                    ],
                    [styles.inputError, showError],
                )}
                onPress={showDatePicker}
                disabled={!editable}>
                {selectedDate && (
                    <Text style={styles.inputText}>{dateString}</Text>
                )}
            </TouchableOpacity>
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && !value && showRequired && (
                <Text style={styles.warningText}>{_('Required')}</Text>
            )}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date(1900, 0, 1)}
            />
        </View>
    );
};

export default DateInput;
