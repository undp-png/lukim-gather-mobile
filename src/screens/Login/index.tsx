import React, {useCallback, useState} from 'react';
import {useMutation} from '@apollo/client';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import parsePhoneNumber from 'libphonenumber-js'

import Text from 'components/Text';
import InputField from 'components/InputField';
import Button from 'components/Button';
import AuthTypeTab from 'components/AuthTypeTab';
import {ModalLoader} from 'components/Loader';

import {TokenAuthMutation, TokenAuthMutationVariables} from '@generated/types';

import {_} from 'services/i18n';
import {dispatchLogin} from 'services/dispatch';
import {LOGIN, PHONE_NUMBER_CONFIRM} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

import {
    PhoneNumberConfirm,
    PhoneNumberConfirmInput,
    MutationPhoneNumberConfirmArgs,
} from 'generated/types';
import styles from './styles';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<string>('email');

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

    const [phone_confirm, {loading: phoneConfirmLoading}] = useMutation<
        PhoneNumberConfirm,
        PhoneNumberConfirmInput
    >(PHONE_NUMBER_CONFIRM, {
        onCompleted: () => {
            const ph = parsePhoneNumber(phone, 'PG');
            const phoneNumber = ph?.formatInternational().replace(/\s/g, '');
            Toast.show('Code successfully sent !!');
            navigation.navigate('VerifyPhone', {phone: phoneNumber});
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleLogin = useCallback(async () => {
        if(selectedTab === 'email') {
            const loginPayload = await login({
                variables: {username: username.toLowerCase(), password},
            });
            if (loginPayload && !loginPayload.errors) {
                navigation.navigate('Feed');
            }
        } else {
            const ph = parsePhoneNumber(phone, 'PG');
            const phoneNumber = ph?.formatInternational().replace(/\s/g, '');
            if(!ph?.isValid()) {
                return Toast.show('Invalid Phone number.', Toast.LONG, [
                    'RCTModalHostViewController',
                ]);
            }
            await phone_confirm({
                variables: {
                    data: {username: phoneNumber}
                },
            });
        }
    }, [username, password, phone, login, navigation]);

    const handleForgotPassword = useCallback(() => {
        navigation.navigate('ForgotPassword');
    }, [navigation]);

    const handleSignUp = useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <ModalLoader loading={loading} />
            <AuthTypeTab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabStyle={styles.tabStyle} 
            />
            {selectedTab === 'email' ? (
                <>
                    <InputField
                        title={_('Email')}
                        input={username}
                        value={username}
                        onChangeText={setUsername}
                        placeholder={_('Enter email')}
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
                </>
            ):(
                <>
                    <InputField
                        title={_('Phone (with country code)')}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={_('Enter phone')}
                    />
                </>
            )}
            <Button
                title={_('Login')}
                disabled={selectedTab==='email'?!(username && password):!phone}
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
        </KeyboardAwareScrollView>
    );
};

export default Login;
