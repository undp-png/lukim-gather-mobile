import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useI18nContext} from '@rna/components/I18n';

import {translations} from 'services/i18n';
import {
    setCurrentLanguage,
    setTranslations,
    setLanguages,
} from 'store/slices/locale';

const SyncLocaleStore: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {languages, selectedLanguage} = useI18nContext();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTranslations(translations));
    }, [dispatch]);

    useEffect(() => {
        dispatch(setLanguages(languages));
        dispatch(setCurrentLanguage(selectedLanguage));
    }, [dispatch, selectedLanguage, languages]);

    return <>{children}</>;
};

export default SyncLocaleStore;
