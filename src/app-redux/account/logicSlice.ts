import {createSlice} from '@reduxjs/toolkit';

/**
 * STORE THE:   1. isLoading: only use for RootScreen and Starter
 */

const initialState: any = {
    isLoading: true,
    resource: {},
};

const logicSlice = createSlice({
    name: 'logicAppSlice',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setResource: (state, action) => {
            state.resource = action.payload;
        },
    },
});

export const logicSliceAction = logicSlice.actions;

export default logicSlice.reducer;
