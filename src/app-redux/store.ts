import {configureStore} from '@reduxjs/toolkit';
import accountSlice from './account/accountSlice';
import logicSlice from './account/logicSlice';

const FindmeStore = configureStore({
    reducer: {
        accountSlice,
        logicSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof FindmeStore.getState>;

export default FindmeStore;
