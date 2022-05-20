import React, {useState, useCallback} from 'react';
import {View} from 'react-native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import Button from 'components/Button';
import InputField from 'components/InputField';
import {ModalLoader} from 'components/Loader';
import Text from 'components/Text';

import {_} from 'services/i18n';
import {CREATE_FEEDBACK} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import {
    CreateFeedbackMutation,
    CreateFeedbackMutationVariables,
} from 'generated/types';

import styles from './styles';

const Feedbacks = () => {
    const navigation = useNavigation<any>();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>('');
    const [items, setItems] = useState([
        {label: 'Issue adding survey', value: 'Issue adding survey'},
        {label: 'Issue with App', value: 'Issue with App'},
        {
            label: 'Suggestion to Lukim Gather',
            value: 'Suggestion to Lukim Gather',
        },
        {label: 'Other', value: 'Other'},
    ]);
    const [description, setDescription] = useState<string>('');
    const [create_feedback, {loading}] = useMutation<
        CreateFeedbackMutation,
        CreateFeedbackMutationVariables
    >(CREATE_FEEDBACK, {
        onCompleted: () => {
            Toast.show(
                'Feedback has been successfully submitted !!',
                Toast.LONG,
            );
            navigation.navigate('Menu');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });
    const handleSubmitFeedback = useCallback(async () => {
        await create_feedback({
            variables: {
                input: {
                    title: value,
                    description,
                },
            },
        });
    }, [create_feedback, value, description]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <View>
                <Text style={styles.pickerLabel} title={_('Issue type')} />
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.picker}
                    textStyle={styles.textStyle}
                    labelStyle={styles.labelStyle}
                />
                <InputField
                    title={_('Explain the issue')}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    inputStyle={styles.description}
                    value={description}
                    onChangeText={setDescription}
                />
                <Button
                    style={styles.button}
                    title={_('Submit')}
                    onPress={handleSubmitFeedback}
                    disabled={!value || !description}
                />
            </View>
        </View>
    );
};

export default Feedbacks;
