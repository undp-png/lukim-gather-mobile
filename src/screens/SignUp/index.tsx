import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';
import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

const SignUp = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title={_('Email or Phone')}
                placeholder="johndoe@example.com"
            />
            <View style={styles.name}>
                <InputField
                    title={_('First name')}
                    placeholder={_('Enter first name')}
                    containerStyle={styles.fullName}
                />
                <InputField
                    title={_('Surname')}
                    placeholder={_('Enter surname')}
                    containerStyle={styles.surName}
                />
            </View>
            <InputField
                title={_('Password')}
                placeholder={_('Enter password')}
                password
            />
            <View style={styles.infoWrapper}>
                <Text style={styles.info}>
                    <Localize>By continuing you agree to our</Localize>
                </Text>
                <TouchableOpacity>
                    <Text style={styles.infoPressable}>
                        <Localize>Terms of services</Localize>
                    </Text>
                </TouchableOpacity>
                <Text style={styles.info}>
                    <Localize>and</Localize>
                </Text>
                <TouchableOpacity>
                    <Text style={styles.infoPressable}>
                        <Localize>Privacy policy.</Localize>
                    </Text>
                </TouchableOpacity>
            </View>
            <AuthButton
                title={_('Create an account')}
                style={styles.button}
                onPress={() => {}}
            />
            <Text style={styles.text}>
                <Localize>Already have an account?</Localize>
            </Text>
        </SafeAreaView>
    );
};

export default SignUp;
