import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';

import styles from './styles';

const SignUp = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title="Email or Phone"
                placeholder="johndoe@example.com"
            />
            <View style={styles.name}>
                <InputField
                    title="First name"
                    placeholder="Enter first name"
                    containerStyle={styles.fullName}
                />
                <InputField
                    title="Surname"
                    placeholder="Enter surname"
                    containerStyle={styles.surName}
                />
            </View>
            <InputField
                title="Password"
                placeholder="Enter password"
                password
            />
            <View style={styles.infoWrapper}>
                <Text style={styles.info}>By continuing you agree to our</Text>
                <TouchableOpacity>
                    <Text style={styles.infoPressable}>Terms of services</Text>
                </TouchableOpacity>
                <Text style={styles.info}>and</Text>
                <TouchableOpacity>
                    <Text style={styles.infoPressable}>Privacy policy.</Text>
                </TouchableOpacity>
            </View>
            <AuthButton
                title="Create an account"
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>Already have an account?</Text>
        </SafeAreaView>
    );
};

export default SignUp;
