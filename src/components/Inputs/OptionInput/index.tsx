import React, {useCallback, useMemo, useState, useRef} from 'react';
import {View, Text} from 'react-native';
import MultiSelect from 'react-native-multiple-select';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';

import {OptionType} from '@generated/types';

import COLORS from 'utils/colors';

import {InputProps} from '../index';
import styles from './styles';

const OptionInput: React.FC<InputProps> = (props: InputProps) => {
    const {
        title,
        titleStyle,
        inputProps,
        input: {value = [], onChange},
        fieldContainerStyle,
        showRequired,
        meta: {error, warning, touched},
    } = props;

    const showError = useMemo(() => touched && !!error, [touched, error]);
    const items = useMemo(() => {
        if (inputProps.options) {
            if (!inputProps.editable) {
                return inputProps.options.map((i: OptionType) => ({
                    ...i,
                    disabled: true,
                }));
            }
            return inputProps.options;
        }
        return [];
    }, [inputProps]);

    const inputRef = useRef() as React.MutableRefObject<MultiSelect>;

    const [selectedItems, setSelectedItems] = useState(
        Array.isArray(value) ? value : [],
    );

    const handleChange = useCallback(
        payload => {
            if (inputProps.editable) {
                onChange && onChange(payload?.length ? payload : null);
                setSelectedItems(payload);
            }
        },
        [onChange, inputProps],
    );

    return (
        <View style={cs(styles.container, fieldContainerStyle)}>
            {!!title && (
                <Text style={cs(styles.title, titleStyle)}>{title}</Text>
            )}
            {!!inputProps.hints && (
                <Text style={styles.hints}>{inputProps.hints}</Text>
            )}
            <MultiSelect
                uniqueKey="id"
                ref={inputRef}
                items={items}
                displayKey="title"
                hideSubmitButton
                fontFamily="Inter-Regular"
                itemFontFamily="Inter-Regular"
                fontSize={16}
                onSelectedItemsChange={handleChange}
                styleDropdownMenu={cs(
                    styles.dropdownMenu,
                    [
                        styles.inputWarning,
                        !!warning ||
                            (!showError &&
                                (!value || value?.length === 0) &&
                                showRequired),
                    ],
                    [styles.inputError, showError],
                )}
                styleListContainer={styles.dropdownList}
                styleTextDropdown={cs(styles.dropdownText, [
                    styles.dropdownTextSelected,
                    selectedItems?.length > 0,
                ])}
                styleDropdownMenuSubsection={styles.dropdownMenuInner}
                styleSelectorContainer={styles.selectorContainer}
                styleRowList={styles.rowItem}
                tagContainerStyle={styles.tagContainer}
                tagRemoveIconColor={COLORS.greyText}
                tagTextColor={COLORS.tertiary}
                removeSelected
                selectedItems={selectedItems}
                textInputProps={{
                    editable: inputProps.editable,
                    autoFocus: false,
                }}
                {...inputProps}
            />
            {inputProps.single && (
                <View>
                    {inputRef?.current?.getSelectedItemsExt(selectedItems)}
                </View>
            )}
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && (!value || value?.length === 0) && showRequired && (
                <Text style={styles.warningText}>{_('Required')}</Text>
            )}
        </View>
    );
};

export default OptionInput;
