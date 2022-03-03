import React from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from 'components/Button';
import TextInput from 'components/TextInput';
import PickerSelect from 'components/PickerSelect';

import issueList from 'services/data/issue.json';

import styles from './styles';

const Feedbacks = () => {
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <PickerSelect
                    data={issueList}
                    label="Issue type"
                    placeholder="Select the issue"
                />
                <TextInput
                    label="Explain the issue"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                />
                <Button title="Submit" />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default Feedbacks;
