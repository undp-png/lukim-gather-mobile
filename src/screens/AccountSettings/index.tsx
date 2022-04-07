import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

const AccountSettings = () => {
    const {user} = useSelector(state => state.auth);

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <MenuItem title={_('Email')} label={user.email} />
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
