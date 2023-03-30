import React from 'react';
import {View} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

const AccountSettings = () => {
    const {user} = useSelector((state: RootStateOrAny) => state.auth);
    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                {user?.email !== null && (
                    <MenuItem
                        title={_('Password')}
                        label={_('Change password')}
                        linkTo="ChangePassword"
                    />
                )}
                {user?.phoneNumber !== null && (
                    <MenuItem
                        title={_('Change Phone Number')}
                        label={_('Phone number')}
                        linkTo="ChangePhone"
                    />
                )}
                <MenuItem
                    title={_('Delete Account')}
                    linkTo="AccountDeletion"
                />
            </View>
        </View>
    );
};

export default AccountSettings;
