import React, {useState, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';

import MenuItem from 'components/MenuItem';
import LanguageSelectModal from 'components/LanguageSelectModal';

import {languages, _} from 'services/i18n';
import {dispatchLocale} from 'services/dispatch';

import {useI18nContext} from '@rna/components/I18n';

import styles from './styles';

const Settings = () => {
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
    const {changeLanguage} = useI18nContext();

    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const toggleLanguageModal = useCallback(() => {
        setShowLanguageModal(!showLanguageModal);
    }, [showLanguageModal]);

    const handleLanguageChange = useCallback(
        langItem => {
            changeLanguage(langItem.code);
            dispatchLocale(langItem.code);
            setShowLanguageModal(false);
        },
        [changeLanguage],
    );
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
            <LanguageSelectModal
                isVisible={showLanguageModal}
                onSelect={handleLanguageChange}
                onBackdropPress={toggleLanguageModal}
                onBackButtonPress={toggleLanguageModal}
            />
        </View>
    );
};

export default Settings;
