import React, {useCallback, useState} from 'react';
import {useMutation} from '@apollo/client';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import Text from 'components/Text';
import InputField from 'components/InputField';
import Button from 'components/Button';
import {ModalLoader} from 'components/Loader';

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

    const [login, {loading}] = useMutation<
        TokenAuthMutation,
        TokenAuthMutationVariables
    >(LOGIN, {
        onCompleted: ({tokenAuth}) => {
            const {token, refreshToken, user} = tokenAuth;
            dispatchLogin(token, refreshToken, user);
            Toast.show(_('Successfully Logged In!'));
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleLogin = useCallback(async () => {
        const loginPayload = await login({
            variables: {username: username.toLowerCase(), password},
        });
        if (loginPayload && !loginPayload.errors) {
            navigation.navigate('Feed');
        }
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
                    value={username}
                    onChangeText={setUsername}
                    placeholder={_('Enter email or phone')}
                />
                <InputField
                    title={_('Password')}
                    input={password}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={_('Enter password')}
                    password
                />
                <View style={styles.infoWrapper}>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text
                            style={styles.info}
                            title={_('Forgot your password?')}
                        />
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
                        <Text
                            style={styles.text}
                            title={_("Don't have an account?")}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
