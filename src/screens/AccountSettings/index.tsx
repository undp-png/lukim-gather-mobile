import React from 'react';
import {View} from 'react-native';

import MenuItem from 'components/MenuItem';

import styles from './styles';

const AccountSettings = () => {
    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <MenuItem title="Email" label="example@mail.com" />
                <MenuItem
                    title="Password"
                    label="Change password"
                    linkTo="ChangePassword"
                />
            </View>
        </View>
    );
};

export default AccountSettings;
