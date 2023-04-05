import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
    useRoute,
    useNavigation,
    type RouteProp,
} from '@react-navigation/native';

import Text from 'components/Text';
import OtpInput from 'components/OtpInput';
import {SaveButton} from 'components/HeaderButton';
import {_} from 'services/i18n';

import type {StackParamList} from 'navigation';

import styles from './styles';

const OTPVerify = () => {
    const route = useRoute<RouteProp<StackParamList, 'OTPVerify'>>();
    const {onSubmitPin, onResendPin, target} = route.params;

    const navigation = useNavigation();

    const [pin, setPin] = useState('');

    const handleResend = useCallback(async () => {
        onResendPin();
    }, [onResendPin]);

    const handleSavePress = useCallback(() => {
        onSubmitPin(pin);
    }, [onSubmitPin, pin]);

    const isPhone = useMemo(() => !target.includes('@'), [target]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleSavePress} />,
            headerTitle: isPhone ? _('Verify Phone Number') : _('Verify Email'),
        });
    }, [navigation, handleSavePress, isPhone]);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <Text
                    style={styles.title}
                    title={
                        (isPhone
                            ? _(
                                  'Please enter the 6 digit code sent to your phone: ',
                              )
                            : _(
                                  'Please enter the 6 digit code sent to your email: ',
                              )) + target
                    }
                />
                <OtpInput setCode={setPin} length={6} />
                <TouchableOpacity
                    style={styles.resendWrapper}
                    onPress={handleResend}>
                    <Text
                        style={styles.text}
                        title={_('Send the code again?')}
                    />
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default OTPVerify;
