import React, {useCallback, useState} from 'react';
import {useMutation} from '@apollo/client';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import parsePhoneNumber from 'libphonenumber-js';

import Text from 'components/Text';
import InputField from 'components/InputField';
import Button from 'components/Button';
import AuthTypeTab from 'components/AuthTypeTab';
import {ModalLoader} from 'components/Loader';

import type {
    TokenAuthMutation,
    TokenAuthMutationVariables,
    CustomObtainJsonWebToken,
    PhoneNumberConfirm,
    MutationPhoneNumberConfirmArgs,
} from '@generated/types';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';
import type {AuthStackParamList} from 'navigation/auth';

import {_} from 'services/i18n';
import Toast from 'utils/toast';
import {dispatchLogin} from 'services/dispatch';
import {LOGIN, PHONE_NUMBER_CONFIRM} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

import styles from './styles';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<string>('email');

    const navigation =
        useNavigation<
            StackNavigationProp<StackParamList & AuthStackParamList>
        >();

    const [login, {loading}] = useMutation<
        TokenAuthMutation,
        TokenAuthMutationVariables
    >(LOGIN, {
        onCompleted: data => {
            const {token, refreshToken, user} =
                data.tokenAuth as CustomObtainJsonWebToken;
            dispatchLogin(token, refreshToken, user);
            navigation.navigate('Feed', {screen: 'Home'});
            Toast.show(_('Successfully logged in!'));
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const [phone_confirm, {loading: phoneConfirmLoading}] = useMutation<
        PhoneNumberConfirm,
        MutationPhoneNumberConfirmArgs
    >(PHONE_NUMBER_CONFIRM, {
        onCompleted: () => {
            const ph = parsePhoneNumber(phone, 'PG');
            const phoneNumber = ph?.formatInternational().replace(/\s/g, '');
            Toast.show(_('Code successfully sent!'));
            navigation.navigate('VerifyPhone', {phone: phoneNumber});
        },
        onError: err => {
            Toast.error(_('Phone number error'), getErrorMessage(err));
            console.log(err);
            if (getErrorMessage(err).includes('been sent')) {
                const ph = parsePhoneNumber(phone, 'PG');
                const phoneNumber = ph
                    ?.formatInternational()
                    .replace(/\s/g, '');
                navigation.navigate('VerifyPhone', {phone: phoneNumber});
            }
        },
    });

    const handleLogin = useCallback(async () => {
        if (selectedTab === 'email') {
            await login({
                variables: {username: username.trim().toLowerCase(), password},
            });
        } else {
            const ph = parsePhoneNumber(phone, 'PG');
            const phoneNumber = ph?.formatInternational().replace(/\s/g, '');
            if (!ph?.isValid()) {
                return Toast.error('Invalid Phone number.');
            }
            await phone_confirm({
                variables: {
                    data: {username: phoneNumber as string},
                },
            });
        }
    }, [username, password, phone, login, phone_confirm, selectedTab]);

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
            <ModalLoader loading={loading || phoneConfirmLoading} />
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
            ) : (
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
                disabled={
                    selectedTab === 'email' ? !(username && password) : !phone
                }
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
