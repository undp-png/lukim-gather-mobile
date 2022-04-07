import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import LocaleState from 'store/types/locale';

const initialState: LocaleState = {
    currentLanguage: 'en',
    languages: [],
    translations: {},
};

const localeSlice = createSlice({
    name: 'locale',
    initialState,
    reducers: {
        setCurrentLanguage: (state, {payload}: PayloadAction<string>) => {
            state.currentLanguage = payload;
        },
        setTranslations: (state, {payload}: PayloadAction<object>) => {
            state.translations = payload;
        },
        setLanguages: (state, {payload}: PayloadAction<string[]>) => {
            state.languages = payload;
        },
    },
});

export const {setCurrentLanguage, setTranslations, setLanguages} =
    localeSlice.actions;

export default localeSlice.reducer;
