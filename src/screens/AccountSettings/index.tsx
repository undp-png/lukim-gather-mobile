import React from 'react';
import {View} from 'react-native';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

const AccountSettings = () => {
    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <MenuItem
                    title={_('Password')}
                    label={_('Change password')}
                    linkTo="ChangePassword"
                />
            </View>
        </View>
    );
};

export default AccountSettings;
