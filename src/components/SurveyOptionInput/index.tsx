import React, {useMemo, useCallback} from 'react';
import {View, Pressable} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import COLORS from 'utils/colors';

import styles from './styles';

export const visibilityOptions = [
    {
        icon: 'lock-outline',
        text: _('Only me'),
        activeOnTrue: false,
    },
    {
        icon: 'globe-outline',
        text: _('Everyone'),
        activeOnTrue: true,
    },
];

export const projectVisibilityOptions = [
    {
        icon: 'people-outline',
        text: _('Project members'),
        activeOnTrue: false,
    },
    {
        icon: 'globe-outline',
        text: _('Everyone'),
        activeOnTrue: true,
    },
];

export const testSurveyOptions = [
    {
        icon: 'checkmark-circle-outline',
        text: _('Real data'),
        activeOnTrue: false,
    },
    {
        icon: 'funnel-outline',
        text: _('Test data'),
        activeOnTrue: true,
    },
];

interface OptionItemProps {
    value?: boolean;
    iconName?: string;
    index?: number;
    text?: string;
    onPress?: ((arg0: any) => void) | null;
    isActive?: boolean;
    style?: object;
}

export const OptionItem: React.FC<OptionItemProps> = ({
    iconName,
    text,
    index,
    isActive,
    onPress,
    style,
    value,
}) => {
    const isDisabled = useMemo(() => onPress === null, [onPress]);

    const handlePress = useCallback(() => {
        onPress?.(value);
    }, [value, onPress]);

    return (
        <Pressable
            disabled={isDisabled}
            style={cs(
                styles.optionItem,
                [styles.activeOptionItem, isActive],
                [styles.spaceLeft, index && index > 0],
                [styles.optionItemDisabled, onPress === null],
                style,
            )}
            onPress={handlePress}>
            <View style={cs(styles.checked, [styles.hide, !isActive])}>
                <Icon
                    name="checkmark-circle-2"
                    height={18}
                    width={18}
                    fill={'#196297'}
                />
            </View>
            <Icon
                width={20}
                height={20}
                name={iconName}
                fill={
                    isActive
                        ? COLORS.accent
                        : isDisabled
                        ? COLORS.inputText
                        : COLORS.greyTextDark
                }
            />
            <Text
                style={cs(
                    styles.optionText,
                    [styles.optionTextActive, isActive],
                    [styles.optionTextDisabled, !isActive && isDisabled],
                )}
                title={text}
            />
        </Pressable>
    );
};

type OptionType = {
    icon: string;
    text: string;
    activeOnTrue: boolean;
};
interface SurveyOptionInputProps {
    style: object;
    options: OptionType[];
    value: boolean;
    disabled?: boolean;
    onChange?: (val: boolean) => void;
}

const SurveyOptionInput: React.FC<SurveyOptionInputProps> = props => {
    const {style, options, value, onChange, disabled} = props;

    return (
        <View style={style}>
            {options.map((o, idx: number) => (
                <OptionItem
                    key={String(idx)}
                    index={idx}
                    value={o.activeOnTrue}
                    isActive={value === o.activeOnTrue}
                    text={o.text}
                    iconName={o.icon}
                    onPress={disabled ? null : onChange}
                />
            ))}
        </View>
    );
};

export default SurveyOptionInput;
