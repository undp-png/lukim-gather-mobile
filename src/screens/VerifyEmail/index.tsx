import React, {useState, useCallback} from 'react';
import {Pressable} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useMutation} from '@apollo/client';

import {ModalLoader} from 'components/Loader';
import Text from 'components/Text';
import Button from 'components/Button';
import OtpInput from 'components/OtpInput';

import {_} from 'services/i18n';
import {PASSWORD_RESET, PASSWORD_RESET_VERIFY} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import Toast from 'utils/toast';
import {
    PasswordResetMutation,
    PasswordResetMutationVariables,
    PasswordResetVerifyMutation,
    PasswordResetVerifyMutationVariables,
} from 'generated/types';

import styles from './styles';

const VerifyEmail = () => {
    const navigation = useNavigation<any>();
    const [pin, setPin] = useState('');
    const route = useRoute<any>();
    const username = route?.params?.email;

    const [email_confirm_verify, {loading: loading}] = useMutation<
        PasswordResetVerifyMutation,
        PasswordResetVerifyMutationVariables
    >(PASSWORD_RESET_VERIFY, {
        onCompleted: res => {
            Toast.show(_('Email verified successfully!'));
            navigation.navigate('CreateNewPassword', {
                username,
                identifier: res?.passwordResetVerify?.result?.identifier,
            });
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handleEmailVerify = useCallback(async () => {
        await email_confirm_verify({
            variables: {
                data: {
                    username: username.toLowerCase(),
                    pin: parseInt(pin, 10),
                },
            },
        });
    }, [email_confirm_verify, username, pin]);

    const [email_confirm, {loading: resendLoading}] = useMutation<
        PasswordResetMutation,
        PasswordResetMutationVariables
    >(PASSWORD_RESET, {
        onCompleted: () => {
            Toast.show(_('Code successfully sent!'));
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handleResendCode = useCallback(async () => {
        await email_confirm({
            variables: {
                data: {
                    username: username.toLowerCase(),
                },
            },
        });
    }, [email_confirm, username]);

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <ModalLoader loading={loading || resendLoading} />
            <Text
                style={styles.title}
                title={`${_(
                    'Please enter the 6 digit code sent to your email:',
                )} ${route?.params?.email.toLowerCase()}`}
            />
            <OtpInput setCode={setPin} length={6} />
            <Button
                title={_('Verify')}
                style={styles.button}
                onPress={handleEmailVerify}
                disabled={pin.length < 6}
            />
            <Pressable style={styles.resendWrapper} onPress={handleResendCode}>
                <Text style={styles.text} title={_('Send the code again?')} />
            </Pressable>
        </KeyboardAwareScrollView>
    );
};

export default VerifyEmail;
