import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import COLORS from 'utils/colors';
import styles from './styles';

interface Props {
    title: string;
    password?: boolean;
    placeholder?: string;
    containerStyle?: object;
}

const InputField: React.FC<Props> = ({
    title,
    password = false,
    containerStyle,
    placeholder,
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
            <Text style={styles.title}>{title}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    onBlur={onBlur}
                    onFocus={onFocus}
                    style={[
                        styles.input,
                        {
                            borderColor: focused
                                ? COLORS.primaryAlt
                                : COLORS.border,
                        },
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                            paddingRight: password ? 44 : 12,
                        },
                    ]}
                    secureTextEntry={hideText ? true : false}
                    placeholderTextColor={COLORS.greyText}
                    placeholder={placeholder}
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
