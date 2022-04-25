import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import MenuItem from 'components/MenuItem';

import {languages, _} from 'services/i18n';

import styles from './styles';

const Settings = () => {
    const navigation = useNavigation();
    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const {currentLanguage} = useSelector(
        (state: RootStateOrAny) => state.locale,
    );
    const lan = useMemo(
        () => languages.find(el => el.code === currentLanguage),
        [currentLanguage],
    );

    const toggleLanguageModal = useCallback(() => {
        navigation.navigate('Lauguage');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                {isAuthenticated && (
                    <MenuItem title={_('Account')} linkTo="AccountSettings" />
                )}
                <MenuItem
                    title={_('Language')}
                    label={_(lan?.title)}
                    onPress={toggleLanguageModal}
                />
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
