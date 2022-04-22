import React, {useCallback, useState} from 'react';
import {useMutation, gql} from '@apollo/client';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';
import InputField from 'components/InputField';
import Button from 'components/Button';
import {ModalLoader} from 'components/Loader';

import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {SIGNUP} from 'services/gql/queries';

import styles from './styles';

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
                    password
                />
                <View style={styles.infoWrapper}>
                    <Text
                        style={styles.info}
                        title={_('By continuing you agree to our')}
                    />
                    <TouchableOpacity>
                        <Text
                            style={styles.infoPressable}
                            title={_('Terms of services')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.info} title={_('and')} />
                    <TouchableOpacity>
                        <Text
                            style={styles.infoPressable}
                            title={_('Privacy policy.')}
                        />
                    </TouchableOpacity>
                </View>
                <Button
                    title={_('Create an account')}
                    style={styles.button}
                    onPress={handleSignUp}
                    disabled={!email || !firstName || !lastName || !password}
                />
                <TouchableOpacity onPress={handleGoLogin} style={styles.login}>
                    <Text
                        style={styles.text}
                        title={_('Already have an account?')}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;
