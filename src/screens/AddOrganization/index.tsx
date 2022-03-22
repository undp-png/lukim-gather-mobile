import React from 'react';
import {SafeAreaView} from 'react-native';

import InputField from 'components/InputField';
import Button from 'components/Button';
import {_} from 'services/i18n';

import styles from './styles';

const AddOrganization = () => {
    return (
        <SafeAreaView style={styles.container}>
            <InputField
                title={_('Organization name')}
                placeholder={_('Enter Organization name')}
            />
            <Button
                title={_('Continue')}
                style={styles.button}
                onPress={() => {}}
            />
        </SafeAreaView>
    );
};

export default AddOrganization;
