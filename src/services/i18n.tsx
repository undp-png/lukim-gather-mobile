import {store} from 'store';
import {defaultTranslator as translator} from '@rna/components/I18n/i18nContext';

export const translations = {
    en: {},
    tpi: {},
};

export const languages = [
    {code: 'en', title: 'English'},
    {code: 'tpi', title: 'Tok Pisin'},
];

export const _ = text => {
    const {
        locale: {currentLanguage, translations},
    } = store.getState();

    return translator(text, currentLanguage, translations);
};
