import React, {useMemo} from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import {Field} from 'redux-form';
import RenderHtml from 'react-native-render-html';

import DateInput from 'components/Inputs/DateInput';
import TextInput from 'components/Inputs/TextInput';
import OptionInput from 'components/Inputs/OptionInput';
import LocationInput from 'components/Inputs/LocationInput';
import BooleanInput from 'components/Inputs/BooleanInput';
import ImageInput from 'components/Inputs/ImageInput';

import {QuestionType} from 'generated/types';

import {isset} from '@rna/utils';

import styles from './styles';

interface QuestionProps {
    item: QuestionType;
    index: number;
    showRequired: boolean | undefined;
}

const requiredValidator = (value?: any) =>
    isset(value) && value !== '' ? undefined : 'This field is required';

const getInputComponent = (question: QuestionType) => {
    switch (question.answerType) {
        case 'DATE':
            return DateInput;
        case 'LOCATION':
            return LocationInput;
        case 'BOOLEAN':
            return BooleanInput;
        case 'SINGLE_OPTION':
        case 'MULTIPLE_OPTION':
            return OptionInput;
        case 'SINGLE_IMAGE':
        case 'MULTIPLE_IMAGE':
            return ImageInput;
        default:
            return TextInput;
    }
};

const Question: React.FC<QuestionProps> = (props: QuestionProps) => {
    const {item, index, showRequired} = props;

    const InputComponent = useMemo(() => getInputComponent(item), [item]);

    const {width} = useWindowDimensions();

    const validations = useMemo(() => {
        const vals = [];
        if (item.isRequired) {
            vals.push(requiredValidator);
        }
        return vals;
    }, [item]);

    return (
        <View>
            {item.answerType !== 'DESCRIPTION' ? (
                <Field
                    name={item.code}
                    component={InputComponent}
                    props={{
                        fieldContainerStyle: styles.fieldContainer,
                        containerStyle: styles.inputContainer,
                        title: item.title,
                        showRequired: item.isRequired && showRequired,
                    }}
                    format={null}
                    inputProps={{
                        keyboardType:
                            item.answerType === 'NUMBER'
                                ? 'phone-pad'
                                : 'default',
                        multiline: item.answerType === 'TEXTAREA',
                        textAlignVertical:
                            item.answerType === 'TEXTAREA' ? 'top' : 'center',
                        single: item.answerType === 'SINGLE_OPTION',
                        selectText:
                            item.answerType === 'SINGLE_OPTION'
                                ? 'Select...'
                                : 'Select all that apply...',
                        multiple: item.answerType === 'MULTIPLE_IMAGE',
                        options: item.options,
                    }}
                    validate={validations}
                />
            ) : (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>{item.title}</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{html: item.description ?? ''}}
                        baseStyle={styles.descriptionText}
                    />
                </View>
            )}
        </View>
    );
};

export default Question;
