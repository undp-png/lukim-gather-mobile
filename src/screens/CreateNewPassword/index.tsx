import React from 'react';
import {SafeAreaView} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';
import {_} from 'services/i18n';

import styles from './styles';

const CreateNewPassword = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title={_('New password')}
                placeholder={_('Enter new password')}
                password
            />
            <InputField
                title={_('Confirm new password')}
                placeholder={_('Re-enter password')}
                password
            />
            <AuthButton
                title={_('Reset Password')}
                style={styles.button}
                onPress={() => {}}
            />
        </SafeAreaView>
    );
};

export default CreateNewPassword;
