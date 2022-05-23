import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';

import {ModalLoader} from 'components/Loader';
import Text from 'components/Text';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {CHANGE_PASSWORD} from 'services/gql/queries';

import styles from './styles';
import {
    ChangePasswordMutation,
    ChangePasswordMutationVariables,
} from 'generated/types';

const ChangePassword = () => {
    const navigation = useNavigation();
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');

    const [change_password, {loading}] = useMutation<
        ChangePasswordMutation,
        ChangePasswordMutationVariables
    >(CHANGE_PASSWORD, {
        onCompleted: () => {
            Toast.show(
                _('Password has been successfully changed!'),
                Toast.LONG,
            );
            navigation.navigate('Menu');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handleChangePassword = useCallback(async () => {
        await change_password({
            variables: {
                data: {
                    password,
                    newPassword,
                    rePassword,
                },
            },
        });
    }, [change_password, newPassword, password, rePassword]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SaveButton onSavePress={handleChangePassword} />
            ),
        });
    }, [handleChangePassword, navigation]);

    const handleForgotPress = useCallback(() => {
        navigation.navigate('ForgotPassword');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <InputField
                        onChangeText={setPassword}
                        title={_('Current password')}
                        placeholder={_('Enter current password')}
                        value={password}
                        password
                    />
                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={handleForgotPress}>
                        <Text
                            style={styles.forgotTitle}
                            title={_('Forgot your password?')}
                        />
                    </TouchableOpacity>
                </View>
                <InputField
                    onChangeText={setNewPassword}
                    title={_('New password')}
                    placeholder={_('Enter new password')}
                    value={newPassword}
                    password
                />
                <InputField
                    onChangeText={setRePassword}
                    title={_('Confirm new password')}
                    placeholder={_('Re-enter new password')}
                    value={rePassword}
                    password
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePassword;
