import React from 'react';
import {SafeAreaView} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';
import {_} from 'services/i18n';

import styles from './styles';

const AddOrganization = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title={_('Organization name')}
                placeholder={_('Enter Organization name')}
            />
            <AuthButton
                title={_('Continue')}
                style={styles.button}
                onPress={() => {}}
            />
        </SafeAreaView>
    );
};

export default AddOrganization;
