import React from 'react';
import {View, Text} from 'react-native';

import MenuItem from 'components/MenuItem';

import styles from './styles';

const Settings = () => {
    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <MenuItem title="Account" linkTo="AccountSettings" />
                <MenuItem title="Language" label="English" />
                <MenuItem title="Synchronization" label="Automatic" />
            </View>
        </View>
    );
};

export default Settings;
