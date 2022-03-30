import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import cs from '@rna/utils/cs';

import COLORS from 'utils/colors';
import styles from './styles';

interface Props {
    input?: string;
    title: string;
    titleDark?: boolean;
    password?: boolean;
    placeholder?: string;
    containerStyle?: object;
    inputStyle?: object;
    [key: string]: any;
}

const InputField: React.FC<Props> = ({
    input,
    title,
    titleDark = false,
    password = false,
    containerStyle,
    inputStyle,
    placeholder,
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

    const onFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const onBlur = useCallback(() => {
        setFocused(false);
    }, []);

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={cs(styles.title, [styles.titleDark, titleDark])}>
                {title}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    onBlur={onBlur}
                    onFocus={onFocus}
                    value={input}
                    style={cs(
                        styles.input,
                        [styles.focused, focused],
                        [styles.password, password],
                        inputStyle,
                    )}
                    secureTextEntry={hideText ? true : false}
                    placeholderTextColor={
                        !titleDark ? COLORS.greyText : COLORS.inputText
                    }
                    placeholder={placeholder}
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
