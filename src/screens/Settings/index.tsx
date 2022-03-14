import React from 'react';
import {View, Text} from 'react-native';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

const Settings = () => {
    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <MenuItem title={_('Account')} linkTo="AccountSettings" />
                <MenuItem title={_('Language')} label={_('English')} />
                <MenuItem title={_('Synchronization')} label={_('Automatic')} />
            </View>
        </View>
    );
};

export default Settings;
