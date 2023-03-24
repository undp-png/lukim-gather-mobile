import React, {useState, useCallback} from 'react';
import {Pressable} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';

import {ModalLoader} from 'components/Loader';
import Text from 'components/Text';
import Button from 'components/Button';
import OtpInput from 'components/OtpInput';
import {dispatchLogin} from 'services/dispatch';

import {_} from 'services/i18n';
import {
    PHONE_NUMBER_CONFIRM,
    PHONE_NUMBER_CONFIRM_VERIFY,
} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import {
    PhoneNumberConfirm,
    MutationPhoneNumberConfirmArgs,
    PhoneNumberConfirmVerifyMutation,
    PhoneNumberConfirmMutationVariables,
    PhoneNumberConfirmVerify,
} from 'generated/types';

import styles from './styles';

const VerifyPhone = () => {
    const navigation = useNavigation<any>();
    const [pin, setPin] = useState('');
    const route = useRoute<any>();
    const phone = route?.params?.phone;

    const [phone_confirm_verify, {loading: loading}] = useMutation<
        PhoneNumberConfirmVerifyMutation,
        PhoneNumberConfirmMutationVariables
    >(PHONE_NUMBER_CONFIRM_VERIFY, {
        onCompleted: data => {
            const {token, refreshToken, user} =
                data.phoneNumberVerify as PhoneNumberConfirmVerify;
            dispatchLogin(token as string, refreshToken as string, user);
            Toast.show('Sucessfully verified Phone!!');
            navigation.navigate('Feed', {screen: 'Home'});
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handlePhoneConfirmVerify = useCallback(async () => {
        await phone_confirm_verify({
            variables: {
                data: {
                    username: phone.toLowerCase(),
                    pin: parseInt(pin, 10),
                },
            },
        });
    }, [phone_confirm_verify, phone, pin]);

    const [phone_confirm, {loading: resendLoading}] = useMutation<
        PhoneNumberConfirm,
        MutationPhoneNumberConfirmArgs
    >(PHONE_NUMBER_CONFIRM, {
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
        await phone_confirm({
            variables: {
                data: {
                    username: phone.toLowerCase(),
                },
            },
        });
    }, [phone_confirm, phone]);

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <ModalLoader loading={loading || resendLoading} />
            <Text
                style={styles.title}
                title={_(
                    `Please enter the 6 digit code sent to your phone: ${route?.params?.phone.toLowerCase()}`,
                )}
            />
            <OtpInput setCode={setPin} length={6} />
            <Button
                title={_('Verify')}
                style={styles.button}
                onPress={handlePhoneConfirmVerify}
                disabled={pin.length < 6}
            />
            <Pressable style={styles.resendWrapper} onPress={handleResendCode}>
                <Text style={styles.text} title={_('Send the code again?')} />
            </Pressable>
        </KeyboardAwareScrollView>
    );
};

export default VerifyPhone;
