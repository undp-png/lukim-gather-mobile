import React, {useMemo, useCallback} from 'react';
import {View, Text} from 'react-native';

import ImagePicker from 'components/ImagePicker';

import cs from '@rna/utils/cs';

import {InputProps} from '../index';
import styles from './styles';

const ImageInput: React.FC<InputProps> = (props: InputProps) => {
    const {
        fieldContainerStyle,
        titleStyle,
        title,
        showRequired,
        input: {onChange, value},
        meta: {touched, error, warning},
        inputProps: {multiple},
    } = props;

    const showError = useMemo(() => touched && !!error, [touched, error]);

    const handleImageChange = useCallback(
        response => {
            if (value?.length) {
                return (
                    onChange &&
                    onChange(
                        multiple
                            ? [...response, ...value]
                            : [response, ...value],
                    )
                );
            }
            onChange && onChange(multiple ? response : [response]);
        },
        [onChange, value, multiple],
    );

    const handleRemoveImage = useCallback(
        images => {
            if (images.length === 0) {
                return onChange(null);
            }
            onChange(images);
        },
        [onChange],
    );

    return (
        <View style={fieldContainerStyle}>
            {!!title && (
                <Text style={cs(styles.title, titleStyle)}>{title}</Text>
            )}
            <View
                style={cs(
                    styles.input,
                    [
                        styles.inputWarning,
                        !!warning || (!showError && !value && showRequired),
                    ],
                    [styles.inputError, showError],
                )}>
                <ImagePicker
                    onChange={handleImageChange}
                    multiple={multiple}
                    images={value ?? []}
                    onRemoveImage={handleRemoveImage}
                />
            </View>
            {showError && <Text style={styles.errorText}>{error}</Text>}
            {!showError && !value && showRequired && (
                <Text style={styles.warningText}>Required</Text>
            )}
        </View>
    );
};

export default ImageInput;
