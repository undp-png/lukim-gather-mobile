import React, {useCallback, useState, useMemo} from 'react';
import {View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {RootStateOrAny, useSelector} from 'react-redux';
import VersionNumber from 'react-native-version-number';

import Button from 'components/Button';
import Text from 'components/Text';
import MenuItem from 'components/MenuItem';
import {ConfirmBox} from 'components/ConfirmationBox';
import {_} from 'services/i18n';

import {dispatchLogout} from 'services/dispatch';

import styles from './styles';

const Menu = () => {
    const {isAuthenticated, user} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [openConfirmLogout, setOpenConfirmLogout] = useState(false);
    const navigation = useNavigation();
    const onProfilePress = useCallback(
        () => navigation.navigate('EditProfile'),
        [navigation],
    );

    const handleLoginPress = useCallback(() => {
        navigation.navigate('Auth', {screen: 'Login'});
    }, [navigation]);

    const handlePressLogout = useCallback(async () => {
        try {
            dispatchLogout();
            setOpenConfirmLogout(false);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleToggleLogout = useCallback(
        () => setOpenConfirmLogout(!openConfirmLogout),
        [openConfirmLogout],
    );

    const versionString = useMemo(() => {
        if (VersionNumber.appVersion && VersionNumber.buildVersion) {
            return `${_('Version')} ${VersionNumber.appVersion}.${
                VersionNumber.buildVersion
            }`;
        }
        return '';
    }, []);

    return (
        <View style={styles.container}>
            <ConfirmBox
                isOpen={openConfirmLogout}
                onCancel={handleToggleLogout}
                onLogout={handlePressLogout}
            />
            <View>
                {isAuthenticated ? (
                    <TouchableOpacity
                        onPress={onProfilePress}
                        style={styles.userInfoWrapper}>
                        <Image
                            source={
                                user?.avatar
                                    ? {uri: user.avatar}
                                    : require('assets/images/user-placeholder.png')
                            }
                            style={styles.userImage}
                        />
                        <View style={styles.userTextInfo}>
                            <View style={styles.textWrapper}>
                                <Text
                                    style={styles.userName}
                                    title={
                                        `${user?.firstName}` +
                                        `${' '}` +
                                        `${user?.lastName}`
                                    }
                                />
                                <Text
                                    style={styles.userOrg}
                                    title={user?.organization}
                                />
                            </View>
                            <Icon
                                name="arrow-ios-forward-outline"
                                height={18}
                                width={18}
                                fill={'#9fa3a9'}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.userInfoWrapper}>
                        <Image
                            source={require('assets/images/user-placeholder.png')}
                            style={styles.userImage}
                        />
                        <Button
                            style={styles.loginButton}
                            title={_('Log in / Sign up')}
                            onPress={handleLoginPress}
                        />
                    </View>
                )}
                <View style={styles.menuWrapper}>
                    <MenuItem title={_('Forms')} linkTo="Forms" />
                    <MenuItem title={_('Settings')} linkTo="Settings" />
                    <MenuItem title={_('About Lukim Gather')} linkTo="About" />
                    <MenuItem title={_('Feedback')} linkTo="Feedback" />
                    <MenuItem title={_('Help')} linkTo="Help" />
                    {isAuthenticated && (
                        <TouchableOpacity
                            onPress={handleToggleLogout}
                            style={styles.menuItem}>
                            <Text
                                style={styles.menuTitle}
                                title={_('Log out')}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <Text style={styles.appVersion} title={versionString} />
        </View>
    );
};

export default Menu;
