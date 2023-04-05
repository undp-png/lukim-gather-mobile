import React, {useMemo} from 'react';
import {View} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';

import MenuItem from 'components/MenuItem';
import {_} from 'services/i18n';

import styles from './styles';

type MenuItemType = {
    title: string;
    linkTo: string;
    label?: string;
};

const AccountSettings = () => {
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const menuItems: MenuItemType[] = useMemo(
        () => [
            {
                title: _('Email'),
                label: user?.email ? _('Change email') : _('Add email'),
                linkTo: 'EmailSettings',
            },
            {
                title: _('Password'),
                label: user?.hasPassword
                    ? _('Change password')
                    : _('Set password'),
                linkTo: 'ChangePassword',
            },
            {
                title: _('Phone Number'),
                label: user?.phoneNumber
                    ? _('Change phone number')
                    : _('Add phone number'),
                linkTo: 'ChangePhone',
            },
            {
                title: _('Delete Account'),
                linkTo: 'AccountDeletion',
            },
        ],
        [user],
    );

    const visibleMenuItems = useMemo(() => {
        if (user?.email) {
            return menuItems;
        }
        return menuItems.filter(menu => menu.linkTo !== 'ChangePassword');
    }, [menuItems, user]);

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                {visibleMenuItems.map(menuItem => (
                    <MenuItem
                        key={menuItem.linkTo}
                        title={menuItem.title}
                        label={menuItem.label}
                        linkTo={menuItem.linkTo}
                    />
                ))}
            </View>
        </View>
    );
};

export default AccountSettings;
