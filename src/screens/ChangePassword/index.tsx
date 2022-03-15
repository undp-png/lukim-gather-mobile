import React, {useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';
import InputField from 'components/InputField';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';

import styles from './styles';

const ChangePassword = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton />,
        });
    });
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <View>
                    <InputField
                        title={_('Current password')}
                        placeholder={_('Enter current password')}
                    />
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text
                            style={styles.forgotTitle}
                            title={_('Forgot your password?')}
                        />
                    </TouchableOpacity>
                </View>
                <InputField
                    title={_('New password')}
                    placeholder={_('Enter new password')}
                />
                <InputField
                    title={_('Confirm new password')}
                    placeholder={_('Re-enter new password')}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePassword;
