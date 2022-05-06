import React from 'react';
import {SafeAreaView, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootStateOrAny, useSelector} from 'react-redux';

import InputField from 'components/InputField';
import Button from 'components/Button';
import {Localize} from '@rna/components/I18n';
import {_} from 'services/i18n';

import styles from './styles';

const ForgotPassword = () => {
    const navigation = useNavigation();

    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );

    const handleNoAccountPress = React.useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>
                    <Localize>
                        Enter the email address or phone number associated with
                        your account
                    </Localize>
                </Text>
                <InputField
                    title={_('Email or Phone')}
                    placeholder="johndoe@example.com"
                />
                <Button
                    title={_('Send Code')}
                    style={styles.button}
                    onPress={() => {}}
                />
                {!isAuthenticated && (
                    <TouchableOpacity
                        style={styles.link}
                        onPress={handleNoAccountPress}>
                        <Text style={styles.text}>
                            <Localize>Don't have an account?</Localize>
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword;
