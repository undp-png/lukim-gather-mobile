import React, {useCallback, useState} from 'react';
import {useMutation} from '@apollo/client';
import {TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import parsePhoneNumber from 'libphonenumber-js';
import DropDownPicker from 'react-native-dropdown-picker';

import Text from 'components/Text';
import InputField from 'components/InputField';
import Button from 'components/Button';
import AuthTypeTab from 'components/AuthTypeTab';
import {ModalLoader} from 'components/Loader';

import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';
import {SIGNUP} from 'services/gql/queries';
import Toast from 'utils/toast';

import type {RegisterUserInput} from '@generated/types';

import styles from './styles';

const SignUp = () => {
    const navigation = useNavigation<any>();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<string>('email');
    const [openGender, setOpenGender] = useState(false);
    const [selectedGender, setSelectedGender] = useState<string | null>('MALE');
    const [genderData, setGenderData] = useState([
        {label: 'Male', value: 'MALE'},
        {label: 'Female', value: 'FEMALE'},
        {label: 'Other', value: 'OTHER'},
        {label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY'},
    ]);

    const [signup, {loading}] = useMutation(SIGNUP, {
        onCompleted: () => {
            if (selectedTab === 'email') {
                Toast.show(_('Success!'), {
                    text2: _('Your account has been successfully created!'),
                });
                // navigation.navigate('ConfirmEmail', {email}); to confirm email
                navigation.navigate('Login');
            } else {
                const ph = parsePhoneNumber(phone, 'PG');
                const phoneNumber = ph
                    ?.formatInternational()
                    .replace(/\s/g, '');
                navigation.navigate('VerifyPhone', {phone: phoneNumber});
            }
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handleSignUp = useCallback(async () => {
        const data: RegisterUserInput = {
            username: '',
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender: selectedGender,
            password,
            rePassword: password,
        };

        if (selectedTab === 'email') {
            data.email = email.trim().toLowerCase();
            data.username = email.trim().toLowerCase();
        } else {
            const ph = parsePhoneNumber(phone, 'PG');
            const phoneNumber = ph?.formatInternational().replace(/\s/g, '');
            if (!ph?.isValid()) {
                return Toast.error('Invalid Phone number.');
            }
            data.username = phoneNumber as string;
            data.phoneNumber = phoneNumber as string;
        }
        await signup({
            variables: {
                data,
            },
        });
    }, [
        firstName,
        lastName,
        selectedGender,
        password,
        selectedTab,
        signup,
        email,
        phone,
    ]);

    const handleGoLogin = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const handlePressTOC = useCallback(() => {
        navigation.navigate('TermsAndCondition');
    }, [navigation]);

    const handlePressPrivacyPolicy = useCallback(() => {
        navigation.navigate('PrivacyPolicy');
    }, [navigation]);

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <ModalLoader loading={loading} />
            <AuthTypeTab
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabStyle={styles.tabStyle}
            />
            {selectedTab === 'email' ? (
                <InputField
                    value={email}
                    onChangeText={setEmail}
                    title={_('Email')}
                    placeholder="johndoe@example.com"
                />
            ) : (
                <InputField
                    value={phone}
                    onChangeText={setPhone}
                    title={_('Phone(with country code)')}
                    placeholder="Enter phone number"
                />
            )}
            <View style={styles.name}>
                <InputField
                    value={firstName}
                    onChangeText={setFirstName}
                    title={_('First name')}
                    placeholder={_('Enter first name')}
                    containerStyle={styles.fullName}
                />
                <InputField
                    value={lastName}
                    onChangeText={setLastName}
                    title={_('Surname')}
                    placeholder={_('Enter surname')}
                    containerStyle={styles.surName}
                />
            </View>
            <Text style={styles.title} title={_('Gender')} />
            <DropDownPicker
                open={openGender}
                value={selectedGender}
                items={genderData}
                setOpen={setOpenGender}
                setValue={setSelectedGender}
                setItems={setGenderData}
                style={styles.selectInput}
                textStyle={styles.selectLabel}
            />
            {selectedTab === 'email' && (
                <InputField
                    onChangeText={setPassword}
                    title={_('Password')}
                    placeholder={_('Enter password')}
                    value={password}
                    password
                />
            )}
            <View style={styles.infoWrapper}>
                <Text
                    style={styles.info}
                    title={_('By continuing you agree to our')}
                />
                <TouchableOpacity onPress={handlePressTOC}>
                    <Text
                        style={styles.infoPressable}
                        title={_('Terms & Condition')}
                    />
                </TouchableOpacity>
                <Text style={styles.info} title={_('and')} />
                <TouchableOpacity onPress={handlePressPrivacyPolicy}>
                    <Text
                        style={styles.infoPressable}
                        title={_('Privacy policy.')}
                    />
                </TouchableOpacity>
            </View>
            <Button
                title={_('Create an account')}
                style={styles.button}
                onPress={handleSignUp}
                disabled={
                    selectedTab === 'email'
                        ? !(email && firstName && lastName && password)
                        : !(phone && firstName && lastName)
                }
            />
            <TouchableOpacity onPress={handleGoLogin} style={styles.login}>
                <Text
                    style={styles.text}
                    title={_('Already have an account?')}
                />
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    );
};

export default SignUp;
