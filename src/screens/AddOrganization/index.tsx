import React from 'react';
import {SafeAreaView} from 'react-native';

import InputField from 'components/InputField';
import AuthButton from 'components/AuthButton';

import styles from './styles';

const AddOrganization = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title="Organization name"
                placeholder="Enter Organization name"
            />
            <AuthButton
                title="Continue"
                style={styles.button}
                onPress={() => {}}
            />
        </SafeAreaView>
    );
};

export default AddOrganization;
