import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {RootStateOrAny, useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Text from 'components/Text';
import {ModalLoader} from 'components/Loader';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {
    PHONE_NUMBER_CHANGE,
    PHONE_NUMBER_CHANGE_VERIFY,
} from 'services/gql/queries';

import {
    PhoneNumberChange,
    MutationPhoneNumberChangeArgs,
    PhoneNumberChangeVerifyMutation,
    MutationPhoneNumberChangeVerifyArgs,
} from 'generated/types';
import useGetUser from 'hooks/useGetUser';
import {dispatchLogout} from 'services/dispatch';

import styles from './styles';

const ChangePhone = () => {
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const getUserData = useGetUser();
    useEffect(() => {
        getUserData();
    }, [getUserData]);

    const navigation = useNavigation();
    const [newPhoneNumber, setNewPhoneNumber] = useState<string>(
        user?.phoneNumber || '',
    );

    const [phoneChangeVerifyMutation, {loading: loadingPhoneChangeVerify}] =
        useMutation<
            PhoneNumberChangeVerifyMutation,
            MutationPhoneNumberChangeVerifyArgs
        >(PHONE_NUMBER_CHANGE_VERIFY, {
            onCompleted: () => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {name: 'Feed'},
                            {name: 'Auth', params: {screen: 'Login'}},
                        ],
                    }),
                );
                Toast.show(
                    _(
                        'Your phone number has been successfully changed. You may login again with your new phone number, or your email!',
                    ),
                    Toast.LONG,
                    ['RCTModalHostViewController'],
                );
                dispatchLogout();
            },
            onError: err => {
                Toast.show(getErrorMessage(err), Toast.LONG, [
                    'RCTModalHostViewController',
                ]);
                console.log(err);
            },
        });

    const handlePinSubmit = useCallback(
        async (pin: string) => {
            await phoneChangeVerifyMutation({
                variables: {
                    data: {
                        pin: Number(pin),
                    },
                },
            });
        },
        [phoneChangeVerifyMutation],
    );

    const [changePhone, {loading}] = useMutation<
        PhoneNumberChange,
        MutationPhoneNumberChangeArgs
    >(PHONE_NUMBER_CHANGE, {
        onCompleted: () => {
            Toast.show(
                _('OTP has been sent to your phone number.'),
                Toast.LONG,
            );
            navigation.navigate('OTPVerify', {
                onSubmitPin: handlePinSubmit,
                onResendPin: handleVerifyPhone,
                target: newPhoneNumber.trim(),
            });
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleVerifyPhone = useCallback(async () => {
        if (
            !newPhoneNumber ||
            (user?.phoneNumber && newPhoneNumber === user?.phoneNumber)
        ) {
            return Toast.show(_('No changes to save!'), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
        }
        await changePhone({
            variables: {
                data: {
                    newPhoneNumber: newPhoneNumber.toLowerCase().trim(),
                },
            },
        });
    }, [changePhone, newPhoneNumber, user]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleVerifyPhone} />,
        });
    }, [handleVerifyPhone, navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading || loadingPhoneChangeVerify} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <InputField
                    onChangeText={setNewPhoneNumber}
                    title={_('New phone number (with country code)')}
                    placeholder={_('Enter new phone number')}
                    value={newPhoneNumber}
                />
                <Text
                    style={styles.infoText}
                    title={_(
                        "Please note that you will be logged out once you've verified your phone number. You may login again using your new phone number.",
                    )}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePhone;
