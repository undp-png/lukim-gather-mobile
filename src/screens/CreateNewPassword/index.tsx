import React from 'react';
import {SafeAreaView} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';

import styles from './styles';

const CreateNewPassword = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title="New password"
                placeholder="Enter new password"
                password
            />
            <InputField
                title="Confirm new password"
                placeholder="Re-enter password"
                password
            />
            <AuthButton
                title="Reset Password"
                style={styles.button}
                onPress={() => {}}
            />
        </SafeAreaView>
    );
};

export default CreateNewPassword;
