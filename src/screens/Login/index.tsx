import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';
import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

const Login = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title={_('Email or Phone')}
                placeholder="johndoe@example.com"
            />
            <InputField
                title={_('Password')}
                placeholder={_('Enter password')}
                password
            />
            <View style={styles.infoWrapper}>
                <TouchableOpacity>
                    <Text style={styles.info}>
                        <Localize>Forgot your password?</Localize>
                    </Text>
                </TouchableOpacity>
            </View>
            <AuthButton
                title={_('Login')}
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>
                <Localize>Don't have an account?</Localize>
            </Text>
        </SafeAreaView>
    );
};

export default Login;
