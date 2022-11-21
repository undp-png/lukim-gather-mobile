import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {SurveyState} from 'store/types/survey';

const initialState: SurveyState = {
    location: {},
};

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setLocation: (
            state,
            {payload}: PayloadAction<SurveyState['location']>,
        ) => {
            state.location = payload;
        },
    },
});

export const {setLocation} = surveySlice.actions;

export default surveySlice.reducer;
