import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';

import styles from './styles';

const Login = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title="Email or Phone"
                placeholder="johndoe@example.com"
            />
            <InputField
                title="Password"
                placeholder="Enter password"
                password
            />
            <View style={styles.infoWrapper}>
                <TouchableOpacity>
                    <Text style={styles.info}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
            <AuthButton
                title="Login"
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>Don't have an account?</Text>
        </SafeAreaView>
    );
};

export default Login;
