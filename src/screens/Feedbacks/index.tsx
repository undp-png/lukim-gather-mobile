import React from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from 'components/Button';
import InputField from 'components/InputField';
import PickerSelect from 'components/PickerSelect';
import {_} from 'services/i18n';

import issueList from 'services/data/issue.json';

import styles from './styles';

const Feedbacks = () => {
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <PickerSelect
                    data={issueList}
                    label={_('Issue type')}
                    placeholder={_('Select the issue')}
                />
                <InputField
                    title={_('Explain the issue')}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical="top"
                />
                <Button title={_('Submit')} />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default Feedbacks;
