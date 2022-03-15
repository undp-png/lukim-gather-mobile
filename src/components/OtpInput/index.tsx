import React, {
    useCallback,
    useState,
    useEffect,
    useMemo,
    createRef,
    forwardRef,
} from 'react';
import {View, TextInput} from 'react-native';

import COLORS from 'utils/colors';

import styles from './styles';

interface InputProps {
    index: number;
    handleChange(text: string, index: number): void;
}

interface OtpInputProps {
    setCode(code: string): void;
    length: number;
}

const Input = forwardRef<TextInput, InputProps>(
    ({index, handleChange}, ref) => {
        const [focused, setFocused] = useState(false);

        const onFocus = useCallback(() => {
            setFocused(true);
        }, []);

        const onBlur = useCallback(() => {
            setFocused(false);
        }, []);

        return (
            <TextInput
                ref={ref}
                onFocus={onFocus}
                onBlur={onBlur}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={text => handleChange(text, index)}
                style={[
                    styles.textInput,
                    {
                        borderColor: focused ? COLORS.primaryAlt : COLORS.grey,
                    },
                ]}
            />
        );
    },
);

const OtpInput: React.FC<OtpInputProps> = ({setCode, length}) => {
    const [otpCode, setOtpCode] = useState(Array(length).fill('\xa0').join(''));

    const refs = useMemo(
        () =>
            Array<number>(length)
                .fill(0)
                .map(() => createRef<TextInput>()),
        [length],
    );

    useEffect(() => {
        refs[0]?.current?.focus();
    }, [refs]);

    const handleChange = useCallback(
        (text, index) => {
            if (text === '') {
                let code =
                    otpCode.substring(0, index) +
                    '\xa0' +
                    otpCode.substring(index + 1);
                setOtpCode(code);
                setCode(code.trim());
            } else {
                let code =
                    otpCode.substring(0, index) +
                    text +
                    otpCode.substring(index + 1);
                setOtpCode(code);
                setCode(code.trim());
                if (index <= length - 2) {
                    refs[index + 1]?.current?.focus();
                }
            }
        },
        [otpCode, setCode, refs, length],
    );

    return (
        <View>
            <View style={styles.container}>
                {Array<number>(length)
                    .fill(0)
                    .map((_, index) => (
                        <Input
                            key={index}
                            index={index}
                            handleChange={handleChange}
                            ref={refs[index]}
                        />
                    ))}
            </View>
        </View>
    );
};

export default OtpInput;
