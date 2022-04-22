import React, {useCallback, useState} from 'react';
import {useMutation} from '@apollo/client';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import InputField from 'components/InputField';
import Button from 'components/Button';
import {ModalLoader} from 'components/Loader';

import {Localize} from '@rna/components/I18n';
import {TokenAuthMutation, TokenAuthMutationVariables} from '@generated/types';

import {_} from 'services/i18n';
import {dispatchLogin} from 'services/dispatch';
import {LOGIN} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

import styles from './styles';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigation = useNavigation();

    const [login, {loading, error}] = useMutation<
        TokenAuthMutation,
        TokenAuthMutationVariables
    >(LOGIN, {
        onCompleted: ({tokenAuth}) => {
            const {token, refreshToken, user} = tokenAuth;
            dispatchLogin(token, refreshToken, user);
            Toast.show('Successfully Logged In !!');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleLogin = useCallback(async () => {
        await login({variables: {username, password}});
        navigation.navigate('Feed');
    }, [username, password, login, navigation]);

    const handleForgotPassword = useCallback(() => {
        navigation.navigate('ForgotPassword');
    }, [navigation]);

    const handleSignUp = useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <ModalLoader loading={loading} />
                <InputField
                    title={_('Email or Phone')}
                    input={username}
                    onChangeText={setUsername}
                    placeholder={_('Enter email or phone')}
                />
                <InputField
                    title={_('Password')}
                    input={password}
                    onChangeText={setPassword}
                    placeholder={_('Enter password')}
                    password
                />
                <View style={styles.infoWrapper}>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.info}>
                            <Localize>Forgot your password?</Localize>
                        </Text>
                    </TouchableOpacity>
                </View>
                <Button
                    title={_('Login')}
                    disabled={!username || !password}
                    style={styles.button}
                    onPress={handleLogin}
                />
                <View style={styles.signUp}>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.text}>
                            <Localize>Don't have an account?</Localize>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
