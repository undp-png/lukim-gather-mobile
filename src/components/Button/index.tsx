import React from 'react';
import {PressableProps} from 'react-native';
import Text from 'components/Text';

import Button from '@rna/components/Button';
import cs from '@rna/utils/cs';

import styles from './styles';

interface Props extends PressableProps {
    style?: object;
    title: string;
    dark?: boolean;
    light?: boolean;
    outline?: boolean;
}

const _Button: React.FC<Props> = ({
    style,
    title,
    dark = false,
    light = false,
    outline = false,
    ...buttonProps
}) => {
    return (
        <Button
            style={cs(
                styles.button,
                [styles.buttonDark, dark],
                [styles.buttonLight, light],
                [styles.buttonOutline, outline],
                [styles.buttonDisabled, buttonProps.disabled],
                style,
            )}
            pressableStyle={styles.buttonContent}
            {...buttonProps}>
            <Text
                style={cs(
                    styles.buttonText,
                    [styles.textDark, dark],
                    [styles.textLight, light],
                )}
                title={title}
            />
        </Button>
    );
};

export default _Button;
