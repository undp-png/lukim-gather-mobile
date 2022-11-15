import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useMutation} from '@apollo/client';

import {ModalLoader} from 'components/Loader';
import {SaveButton} from 'components/HeaderButton';
import InputField from 'components/InputField';
import {_} from 'services/i18n';
import Text from 'components/Text';
import {dispatchLogout} from 'services/dispatch';
import {getErrorMessage} from 'utils/error';
import {DELETE_ACCOUNT} from 'services/gql/queries';

import {
    DeleteAccountMutation,
    DeleteAccountMutationVariables,
} from 'generated/types';

import styles from './styles';

export default () => {
    const navigation = useNavigation();
    const [reason, setReason] = useState<string>('');

    const [delete_account, {loading}] = useMutation<
        DeleteAccountMutation,
        DeleteAccountMutationVariables
    >(DELETE_ACCOUNT, {
        onCompleted: () => {
            Toast.show(
                _(
                    'Your account deletion request have been successfully submitted!',
                ),
                Toast.LONG,
                ['RCTModalHostViewController'],
            );
            dispatchLogout();
            navigation.goBack();
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });
    const handleSave = useCallback(async () => {
        await delete_account({
            variables: {
                data: {
                    reason,
                },
            },
        });
    }, [delete_account, reason]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleSave} />,
        });
    }, [handleSave, navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <Text
                title={`We\'re sorry to hear you\'d like to delete your account.  When you submit this form, your photos, entries, account and all other data will be removed permanently and will not be recoverable.
                    \n\nOur administrator will delete your account within around 48 hours after you submit this form. A email/sms will be sent to you when the deletion is complete.`}
            />
            <InputField
                onChangeText={setReason}
                title={_('Reason (optional)')}
                placeholder={_('Enter your reason for account deletion')}
                value={reason}
                multiline
            />
        </View>
    );
};
