import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import InfoState from 'store/types/info';

const initialState: InfoState = {
    info: {},
};

const infoSlice = createSlice({
    name: 'lukimInfo',
    initialState,
    reducers: {
        setInfo: (state, {payload}: PayloadAction<object>) => {
            state.info = payload;
        },
    },
});

export const {setInfo} = infoSlice.actions;

export default infoSlice.reducer;
