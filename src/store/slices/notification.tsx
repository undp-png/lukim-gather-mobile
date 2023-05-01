import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import NotificationState from 'store/types/notification';

const initialState: NotificationState = {
    fcmToken: null,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setFcmToken: (state, {payload}: PayloadAction<string>) => {
            state.fcmToken = payload;
        },
    },
});

export const {setFcmToken} = notificationSlice.actions;

export default notificationSlice.reducer;
