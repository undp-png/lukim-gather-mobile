import React, {useState, useCallback, useEffect} from 'react';
import {View, Pressable} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';

import Text from 'components/Text';
import OtpInput from 'components/OtpInput';
import {ModalLoader} from 'components/Loader';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {
    PHONE_NUMBER_CHANGE_VERIFY,
    PHONE_NUMBER_CHANGE,
} from 'services/gql/queries';

import {dispatchLogout} from 'services/dispatch';

import styles from './styles';

const ChangePhoneVerify = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();

    const [pin, setPin] = useState('');

    const [change_phone_verify, {loading}] = useMutation(
        PHONE_NUMBER_CHANGE_VERIFY,
        {
            onCompleted: () => {
                Toast.show(
                    _('Your phone number has been successfully changed!'),
                    Toast.LONG,
                );
                dispatchLogout();
            },
            onError: err => {
                Toast.show(getErrorMessage(err), Toast.LONG, [
                    'RCTModalHostViewController',
                ]);
                console.log(err);
            },
        },
    );

    const handleChangePhoneVerify = useCallback(async () => {
        await change_phone_verify({
            variables: {
                data: {
                    pin: parseInt(pin, 10),
                },
            },
        });
    }, [change_phone_verify, pin]);

    const [change_phone, {loading: resendLoading}] = useMutation(
        PHONE_NUMBER_CHANGE,
        {
            onCompleted: () => {
                Toast.show(
                    _('OTP has been sent to your new mobile number.'),
                    Toast.LONG,
                );
            },
            onError: err => {
                Toast.show(getErrorMessage(err), Toast.LONG, [
                    'RCTModalHostViewController',
                ]);
                console.log(err);
            },
        },
    );

    const handleResend = useCallback(async () => {
        await change_phone({
            variables: {
                data: {
                    newPhoneNumber: route?.params?.phone,
                },
            },
        });
    }, [change_phone, route?.params?.phone]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SaveButton onSavePress={handleChangePhoneVerify} />
            ),
        });
    }, [handleChangePhoneVerify, navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading || resendLoading} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <Text
                    style={styles.title}
                    title={_(
                        `Please enter the 6 digit code sent to your phone: ${route?.params?.phone}`,
                    )}
                />
                <OtpInput setCode={setPin} length={6} />
                <Pressable style={styles.resendWrapper} onPress={handleResend}>
                    <Text
                        style={styles.text}
                        title={_('Send the code again?')}
                    />
                </Pressable>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePhoneVerify;
