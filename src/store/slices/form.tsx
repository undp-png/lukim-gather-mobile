import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {FormDataType} from 'screens/Webviewform';

type FormState = {
    [key: string]: FormDataType;
};

const initialState: FormState = {};

const formSlice = createSlice({
    name: 'lukimInfo',
    initialState,
    reducers: {
        setFormData: (
            state,
            {payload}: PayloadAction<{key: string; value: string}>,
        ) => {
            if (state[payload.key]) {
                state[payload.key].data = payload.value;
            } else {
                state[payload.key] = {data: payload.value};
            }
        },
        setFormMedia: (
            state,
            {payload}: PayloadAction<{key: string; value: string}>,
        ) => {
            if (state[payload.key]) {
                state[payload.key].media = payload.value;
            } else {
                state[payload.key] = {media: payload.value};
            }
        },
        resetForm: (state, {payload}: PayloadAction<string>) => {
            if (payload) {
                delete state[payload];
            }
        },
    },
});

export const {setFormData, setFormMedia, resetForm} = formSlice.actions;

export default formSlice.reducer;
