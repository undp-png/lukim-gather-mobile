import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

const Settings = () => {
    const {isAuthenticated} = useSelector(state => state.auth);

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                {isAuthenticated && (
                    <MenuItem title={_('Account')} linkTo="AccountSettings" />
                )}
                <MenuItem title={_('Language')} label={_('English')} />
                {isAuthenticated && (
                    <MenuItem
                        title={_('Synchronization')}
                        label={_('Automatic')}
                    />
                )}
            </View>
        </View>
    );
};

export default Settings;
