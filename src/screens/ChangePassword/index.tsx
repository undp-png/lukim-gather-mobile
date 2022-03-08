import React, {useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';
import TextInput from 'components/TextInput';
import {SaveButton} from 'components/HeaderButton';

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
                    <TextInput
                        label="Current password"
                        placeholder="Enter current password"
                    />
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text
                            style={styles.forgotTitle}
                            title="Forgot your password?"
                        />
                    </TouchableOpacity>
                </View>
                <TextInput
                    label="New password"
                    placeholder="Enter new password"
                />
                <TextInput
                    label="Confirm new password"
                    placeholder="Re-enter new password"
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePassword;
