import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {RootStateOrAny, useSelector} from 'react-redux';

import Text from 'components/Text';
import {ModalLoader} from 'components/Loader';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';

import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {
    EMAIL_CHANGE,
    EMAIL_CHANGE_VERIFY,
    SET_PASSWORD,
} from 'services/gql/queries';
import {dispatchLogout} from 'services/dispatch';
import Toast from 'utils/toast';
import useGetUser from 'hooks/useGetUser';

import type {
    EmailChange,
    MutationEmailChangeArgs,
    EmailChangeInput,
    SetPassword,
    MutationSetPasswordArgs,
} from '@generated/types';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';

import styles from './styles';

type EmailSettingsNavigationProp = StackNavigationProp<StackParamList>;

const EmailSettings = () => {
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const getUserData = useGetUser();
    useEffect(() => {
        getUserData();
    }, [getUserData]);

    const navigation = useNavigation<EmailSettingsNavigationProp>();
    const [newEmail, setNewEmail] = useState<string>(user?.email || '');
    const [newPassword, setNewPassword] = useState<string>('');

    const handleCompletion = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    {name: 'Feed'},
                    {name: 'Auth', params: {screen: 'Login'}},
                ],
            }),
        );
        Toast.show(_('Email successfully changed!'), {
            text2: _(
                'You may login again with your new email, or your phone number!',
            ),
        });
        dispatchLogout();
    }, [navigation]);

    const [setPasswordMutation, {loading: loadingSetPassword}] = useMutation<
        SetPassword,
        MutationSetPasswordArgs
    >(SET_PASSWORD, {
        onCompleted: () => {
            getUserData();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Feed', params: {screen: 'Home'}}],
                }),
            );
        },
        onError: err => {
            getUserData();
            Toast.error(
                _('Error setting password'),
                _(
                    'There was an error setting your password. You may still set your password from the Password Settings menu',
                ),
            );
            navigation.dispatch(
                CommonActions.reset({
                    index: 3,
                    routes: [
                        {name: 'Feed', params: {screen: 'Menu'}},
                        {name: 'Settings'},
                        {name: 'AccountSettings'},
                        {name: 'ChangePassword'},
                    ],
                }),
            );
            console.log(err);
        },
    });

    const [emailChangeVerifyMutation, {loading: loadingVerifyEmail}] =
        useMutation(EMAIL_CHANGE_VERIFY, {
            onCompleted: async () => {
                if (user?.email) {
                    handleCompletion();
                } else {
                    Toast.show(_('Email successfully changed!'));
                    await setPasswordMutation({
                        variables: {
                            data: {
                                newPassword,
                                rePassword: newPassword,
                            },
                        },
                    });
                }
            },
            onError: err => {
                Toast.error(_('Error!'), getErrorMessage(err));
                console.log(err);
            },
        });

    const handlePinSubmit = useCallback(
        async (pin: string) => {
            await emailChangeVerifyMutation({
                variables: {
                    data: {
                        pin: Number(pin),
                    },
                },
            });
        },
        [emailChangeVerifyMutation],
    );

    const [changeEmail, {loading}] = useMutation<
        EmailChange,
        MutationEmailChangeArgs
    >(EMAIL_CHANGE, {
        onCompleted: () => {
            Toast.show(_('Success'), {
                text2: _(
                    'Email confimation pin has been sent to your new email!',
                ),
            });
            navigation.navigate('OTPVerify', {
                onSubmitPin: handlePinSubmit,
                onResendPin: handleVerifyEmail,
                target: newEmail.trim().toLowerCase(),
            });
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handleVerifyEmail = useCallback(async () => {
        if (!newEmail || user?.email === newEmail) {
            return Toast.error(
                _('No changes to save'),
                _('Please enter a new email address.'),
            );
        }
        if (!user?.email) {
            if (/^\d+$/.test(newPassword)) {
                return Toast.error(
                    _('Your password must not be entirely numeric!'),
                );
            }
            if (newPassword.length < 8) {
                return Toast.error(
                    _('Your password must contain at least 8 characters'),
                );
            }
        }
        await changeEmail({
            variables: {
                data: {
                    newEmail: newEmail.trim().toLowerCase(),
                    option: (user?.email
                        ? 'CHANGE'
                        : 'ADD') as EmailChangeInput['option'],
                },
            },
        });
    }, [changeEmail, newEmail, user, newPassword]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: user?.email ? _('Change Email') : _('New Email'),
            headerRight: () => <SaveButton onSavePress={handleVerifyEmail} />,
        });
    }, [handleVerifyEmail, user, navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader
                loading={loading || loadingVerifyEmail || loadingSetPassword}
            />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <InputField
                    onChangeText={setNewEmail}
                    title={_('Email')}
                    placeholder={_('Enter new email')}
                    value={newEmail}
                />
                <Text
                    style={styles.infoText}
                    title={
                        user?.email
                            ? _(
                                  'When you change your email, we will send you an email at your new address to confirm it. The new address will not become active until confirmed.',
                              )
                            : _(
                                  'When you add an email, we will send you an email at that address to confirm it. Your email will not be set until confirmed.',
                              )
                    }
                />
                {Boolean(user?.email) && (
                    <Text
                        style={styles.infoText}
                        title={_(
                            'Please note that you will be logged out of your account when your email is changed. You may log back in using your new email address, or your phone number.',
                        )}
                    />
                )}
                {!user?.email && (
                    <View>
                        <InputField
                            onChangeText={setNewPassword}
                            title={_('Password')}
                            placeholder={_('Enter password')}
                            value={newPassword}
                            password
                        />
                        <>
                            <Text
                                style={styles.infoText}
                                title={_(
                                    "Your password can't be too similar to your other personal information.",
                                )}
                            />
                            <Text
                                style={styles.infoText}
                                title={_(
                                    'Your password must contain at least 8 characters.',
                                )}
                            />
                            <Text
                                style={styles.infoText}
                                title={_(
                                    "Your password can't be a commonly used password.",
                                )}
                            />
                            <Text
                                style={styles.infoText}
                                title={_(
                                    "Your password can't be entirely numeric",
                                )}
                            />
                            <Text
                                style={styles.infoText}
                                title={_(
                                    'Please note that you may still set your password later from the Password Settings menu.',
                                )}
                            />
                        </>
                    </View>
                )}
            </KeyboardAwareScrollView>
        </View>
    );
};

export default EmailSettings;
