import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {RootStateOrAny, useSelector} from 'react-redux';

import {ModalLoader} from 'components/Loader';
import Text from 'components/Text';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {CHANGE_PASSWORD, SET_PASSWORD} from 'services/gql/queries';
import useGetUser from 'hooks/useGetUser';
import Toast from 'utils/toast';

import styles from './styles';
import {
    ChangePasswordMutation,
    ChangePasswordMutationVariables,
    SetPassword,
    MutationSetPasswordArgs,
} from 'generated/types';

const ChangePassword = () => {
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const getUserData = useGetUser();
    useEffect(() => {
        getUserData();
    }, [getUserData]);

    const navigation = useNavigation();
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');

    const [change_password, {loading}] = useMutation<
        ChangePasswordMutation,
        ChangePasswordMutationVariables
    >(CHANGE_PASSWORD, {
        onCompleted: () => {
            Toast.show(_('Password has been successfully changed!'));
            navigation.navigate('Menu');
        },
        onError: err => {
            Toast.error(_('Error changing password!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const [setPasswordMutation, {loading: loadingSetPassword}] = useMutation<
        SetPassword,
        MutationSetPasswordArgs
    >(SET_PASSWORD, {
        onCompleted: () => {
            Toast.show(_('Password has been successfully changed!'));
            navigation.navigate('Menu');
        },
        onError: err => {
            Toast.error(_('Error changing password!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handleChangePassword = useCallback(async () => {
        if (user.hasPassword) {
            await change_password({
                variables: {
                    data: {
                        password,
                        newPassword,
                        rePassword,
                    },
                },
            });
        } else {
            await setPasswordMutation({
                variables: {
                    data: {
                        newPassword,
                        rePassword,
                    },
                },
            });
        }
    }, [
        change_password,
        setPasswordMutation,
        newPassword,
        password,
        rePassword,
        user?.hasPassword,
    ]);

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
            <ModalLoader loading={loading || loadingSetPassword} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                {user?.hasPassword && (
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
                )}
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
