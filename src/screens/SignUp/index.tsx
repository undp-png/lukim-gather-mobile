import React, {useCallback, useState} from 'react';
import {useMutation, gql} from '@apollo/client';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';

import InputField from 'components/InputField';
import Button from 'components/Button';
import {ModalLoader} from 'components/Loader';

import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';

import styles from './styles';

const SIGNUP = gql`
    mutation RegisterUser($data: RegisterUserInput!) {
        registerUser(data: $data) {
            ok
            errors
        }
    }
`;

const SignUp = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigation = useNavigation();
    const [signup, {loading, error}] = useMutation(SIGNUP, {
        onCompleted: () => {
            Toast.show('Your account has been successfully created !!');
            navigation.navigate('Login');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleSignUp = useCallback(async () => {
        await signup({
            variables: {
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                    rePassword: password,
                    username: email,
                },
            },
        });
    }, [email, firstName, lastName, password, signup]);

    const handleGoLogin = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <ModalLoader loading={loading} />
                <InputField
                    input={email}
                    onChangeText={setEmail}
                    title={_('Email or Phone')}
                    placeholder="johndoe@example.com"
                />
                <View style={styles.name}>
                    <InputField
                        input={firstName}
                        onChangeText={setFirstName}
                        title={_('First name')}
                        placeholder={_('Enter first name')}
                        containerStyle={styles.fullName}
                    />
                    <InputField
                        input={lastName}
                        onChangeText={setLastName}
                        title={_('Surname')}
                        placeholder={_('Enter surname')}
                        containerStyle={styles.surName}
                    />
                </View>
                <InputField
                    onChangeText={setPassword}
                    title={_('Password')}
                    placeholder={_('Enter password')}
                    input={password}
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
                <Button
                    title={_('Create an account')}
                    style={styles.button}
                    onPress={handleSignUp}
                />
                <TouchableOpacity onPress={handleGoLogin} style={styles.login}>
                    <Text style={styles.text}>
                        <Localize>Already have an account?</Localize>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;
