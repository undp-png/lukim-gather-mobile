import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import cs from '@rna/utils/cs';

import COLORS from 'utils/colors';
import styles from './styles';

interface Props {
    input?: string;
    title?: string;
    titleDark?: boolean;
    password?: boolean;
    searchInput?: boolean;
    placeholder?: string;
    containerStyle?: object;
    inputStyle?: object;
    [key: string]: any;
}

const InputField: React.FC<Props> = ({
    value,
    title,
    titleDark = false,
    password = false,
    searchInput = false,
    containerStyle,
    inputStyle,
    multiline,
    ...inputProps
}) => {
    const [focused, setFocused] = useState(false);
    const [hideText, setHideText] = useState(false);

    useEffect(() => {
        if (password) {
            setHideText(true);
        }
    }, [password]);

    const handleEyeIconPress = useCallback(() => {
        setHideText(!hideText);
    }, [hideText]);

    const handleFocus = useCallback(
        e => {
            setFocused(true);
            inputProps.onFocus && inputProps.onFocus(e);
        },
        [inputProps],
    );

    const handleBlur = useCallback(
        e => {
            setFocused(false);
            inputProps.onBlur && inputProps.onBlur(e);
        },
        [inputProps],
    );

    return (
        <View style={[styles.container, containerStyle]}>
            {!!title && (
                <Text style={cs(styles.title, [styles.titleDark, titleDark])}>
                    {title}
                </Text>
            )}
            <View style={styles.inputContainer}>
                {searchInput && (
                    <View style={styles.searchIconWrapper}>
                        <Icon
                            fill="#888C94"
                            name="search"
                            height={20}
                            width={20}
                        />
                    </View>
                )}
                <TextInput
                    style={cs(
                        styles.input,
                        [styles.focused, focused],
                        [styles.password, password],
                        [styles.search, searchInput],
                        [styles.textarea, multiline],
                        inputStyle,
                    )}
                    secureTextEntry={hideText ? true : false}
                    placeholderTextColor={
                        !titleDark ? COLORS.greyText : COLORS.inputText
                    }
                    multiline={multiline}
                    value={value}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    {...inputProps}
                />
                {password && (
                    <View style={styles.iconWrapper}>
                        <Icon
                            fill="#70747E"
                            name={hideText ? 'eye-off-outline' : 'eye-outline'}
                            height={23}
                            width={23}
                            onPress={handleEyeIconPress}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default InputField;
