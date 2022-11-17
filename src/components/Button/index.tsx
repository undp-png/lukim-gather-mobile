import React from 'react';
import {PressableProps} from 'react-native';
import Text from 'components/Text';
import {Icon} from 'react-native-eva-icons';

import Button from '@rna/components/Button';
import cs from '@rna/utils/cs';
import COLORS from 'utils/colors';

import styles from './styles';

interface Props extends PressableProps {
    style?: object;
    textStyle?: object;
    title: string;
    dark?: boolean;
    light?: boolean;
    blue?: boolean;
    outline?: boolean;
    icon?: string;
    iconProps?: object;
}

const _Button: React.FC<Props> = ({
    style,
    title,
    dark = false,
    light = false,
    blue = false,
    outline = false,
    textStyle,
    icon,
    iconProps = {},
    ...buttonProps
}) => {
    return (
        <Button
            style={cs(
                styles.button,
                [styles.buttonDark, dark],
                [styles.buttonLight, light],
                [styles.buttonBlue, blue],
                [styles.buttonOutline, outline],
                [styles.buttonDisabled, buttonProps.disabled],
                style,
            )}
            pressableStyle={styles.buttonContent}
            {...buttonProps}>
            {Boolean(icon) && (
                <Icon
                    name={icon}
                    fill={light ? COLORS.blueTextAlt : COLORS.secondary}
                    width={20}
                    height={20}
                    style={styles.icon}
                    {...iconProps}
                />
            )}
            <Text
                style={cs(
                    styles.buttonText,
                    [styles.textDark, dark],
                    [styles.textLight, light],
                    [styles.textWhite, blue],
                    textStyle,
                )}
                title={title}
            />
        </Button>
    );
};

export default _Button;
