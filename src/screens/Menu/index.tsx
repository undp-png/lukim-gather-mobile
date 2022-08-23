import React, {useCallback, useState, useMemo} from 'react';
import {View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {RootStateOrAny, useSelector} from 'react-redux';
import VersionNumber from 'react-native-version-number';

import {useI18nContext} from '@rna/components/I18n';
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
    const {selectedLanguage} = useI18nContext();

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
            return `${_('Version', selectedLanguage)} ${
                VersionNumber.appVersion
            }.${VersionNumber.buildVersion}`;
        }
        return '';
    }, [selectedLanguage]);

    return (
        <View style={styles.container}>
            <ConfirmBox
                isLogoutBox={true}
                headerText={_('Log out', selectedLanguage)}
                descriptionText={_(
                    'Are you sure you want to log out?',
                    selectedLanguage,
                )}
                isOpen={openConfirmLogout}
                onCancel={handleToggleLogout}
                positiveText={_('Yes, log out', selectedLanguage)}
                onPositive={handlePressLogout}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
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
                                    style={styles.userInfo}
                                    title={user?.email}
                                />
                                <Text
                                    style={styles.userInfo}
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
                            title={_('Log in / Sign up', selectedLanguage)}
                            onPress={handleLoginPress}
                        />
                    </View>
                )}
                <View style={styles.menuWrapper}>
                    <MenuItem
                        title={_('Forms', selectedLanguage)}
                        linkTo="Forms"
                    />
                    <MenuItem
                        title={_('Settings', selectedLanguage)}
                        linkTo="Settings"
                    />
                    <MenuItem
                        title={_('About Lukim Gather', selectedLanguage)}
                        linkTo="About"
                    />
                    <MenuItem
                        title={_('Feedback', selectedLanguage)}
                        linkTo="Feedback"
                    />
                    <MenuItem
                        title={_('Help', selectedLanguage)}
                        linkTo="Help"
                    />
                    <MenuItem
                        title={_('Terms & Condition', selectedLanguage)}
                        linkTo="TermsAndCondition"
                    />
                    {isAuthenticated && (
                        <TouchableOpacity
                            onPress={handleToggleLogout}
                            style={styles.menuItem}>
                            <Text
                                style={styles.menuTitle}
                                title={_('Log out', selectedLanguage)}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
            <Text
                style={styles.appVersion}
                title={`${versionString} | ${selectedLanguage}`}
            />
        </View>
    );
};

export default Menu;
