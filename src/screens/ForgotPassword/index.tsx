import React from 'react';
import {SafeAreaView, Text} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';
import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

const ForgotPassword = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Enter the email address or phone number associated with your
                account
            </Text>
            <InputField
                title={_('Email or Phone')}
                placeholder="johndoe@example.com"
            />
            <AuthButton
                title={_('Send Code')}
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>
                <Localize>Don't have an account?</Localize>
            </Text>
        </SafeAreaView>
    );
};

export default ForgotPassword;
