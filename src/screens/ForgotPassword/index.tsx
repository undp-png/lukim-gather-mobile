import React from 'react';
import {SafeAreaView, Text} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';

import styles from './styles';

const ForgotPassword = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Enter the email address or phone number associated with your
                account
            </Text>
            <InputField
                title="Email or Phone"
                placeholder="johndoe@example.com"
            />
            <AuthButton
                title="Send Code"
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>Don't have an account?</Text>
        </SafeAreaView>
    );
};

export default ForgotPassword;
