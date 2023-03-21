import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';

import {ModalLoader} from 'components/Loader';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {PHONE_NUMBER_CHANGE} from 'services/gql/queries';

import styles from './styles';

const ChangePhone = () => {
    const navigation = useNavigation();
    const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');

    const [change_phone, {loading}] = useMutation(PHONE_NUMBER_CHANGE, {
        onCompleted: () => {
            Toast.show(
                _('OTP has been sent to your new mobile number.'),
                Toast.LONG,
            );
            navigation.navigate('ChangePhoneVerify', {phone: newPhoneNumber});
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleVerifyPhone = useCallback(async () => {
        await change_phone({
            variables: {
                data: {
                    newPhoneNumber,
                },
            },
        });
    }, [change_phone, newPhoneNumber]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleVerifyPhone} />,
        });
    }, [handleVerifyPhone, navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <InputField
                    onChangeText={setNewPhoneNumber}
                    title={_('New phone number (with country code)')}
                    placeholder={_('Enter new phone number')}
                    value={newPhoneNumber}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePhone;
