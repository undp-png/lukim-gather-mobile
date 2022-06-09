import React, {useState, useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';

import {ModalLoader} from 'components/Loader';
import Text from 'components/Text';
import Button from 'components/Button';
import OtpInput from 'components/OtpInput';

import {_} from 'services/i18n';
import {EMAIL_CONFIRM, EMAIL_CONFIRM_VERIFY} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import {
    EmailConfirmMutation,
    EmailConfirmMutationVariables,
    EmailConfirmVerifyMutation,
    EmailConfirmVerifyMutationVariables,
} from 'generated/types';

import styles from './styles';

const ConfirmEmail = () => {
    const navigation = useNavigation<any>();
    const [pin, setPin] = useState('');
    const route = useRoute<any>();
    const username = route?.params?.email;

    const [email_confirm_verify, {loading: loading}] = useMutation<
        EmailConfirmVerifyMutation,
        EmailConfirmVerifyMutationVariables
    >(EMAIL_CONFIRM_VERIFY, {
        onCompleted: () => {
            Toast.show('Account activated successfully !!');
            navigation.navigate('Login');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleEmailConfirmVerify = useCallback(async () => {
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
        EmailConfirmMutation,
        EmailConfirmMutationVariables
    >(EMAIL_CONFIRM, {
        onCompleted: () => {
            Toast.show('Code successfully sent !!');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
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
        <View style={styles.container}>
            <ModalLoader loading={loading || resendLoading} />
            <Text
                style={styles.title}
                title={_(
                    `Please enter the 6 digit code sent to your email: ${route?.params?.email.toLowerCase()}`,
                )}
            />
            <OtpInput setCode={setPin} length={6} />
            <Button
                title={_('Verify')}
                style={styles.button}
                onPress={handleEmailConfirmVerify}
                disabled={pin.length < 6}
            />
            <Pressable style={styles.resendWrapper} onPress={handleResendCode}>
                <Text style={styles.text} title={_('Send the code again?')} />
            </Pressable>
        </View>
    );
};

export default ConfirmEmail;
