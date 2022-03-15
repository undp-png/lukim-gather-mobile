import React, {useState} from 'react';
import {SafeAreaView, Text} from 'react-native';

import AuthButton from 'components/AuthButton';
import OtpInput from 'components/OtpInput';

import styles from './styles';

const VerifyEmail = () => {
    const [pin, setPin] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Please enter the 6 digit code sent to your email:
                johndoe@exampple.com
            </Text>
            <OtpInput setCode={setPin} length={6} />
            <AuthButton
                title="Verify"
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>Send the code again?</Text>
        </SafeAreaView>
    );
};

export default VerifyEmail;
