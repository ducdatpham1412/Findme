import {createSlice} from '@reduxjs/toolkit';
import {languageType, themeType} from 'asset/name';

/**
 * STORE THE:   1. INFO OF USER
 *              2. THEME OF EACH ACCOUNT
 *              3. MODE EXP WHEN OPENING APP
 *              4. isLoading: is only used for loading resource in RootScreen to choose *               go to Login or Main
 */
const initialState = {
    // info account
    login: {
        username: '',
        password: '',
        token: undefined,
        refreshToken: undefined,
    },
    profile: {
        info: {
            name: 'Findme',
            description: '',
            avatar: 'https://i.pinimg.com/564x/2c/53/9d/2c539d96b5828c9d1112500ea48f9d13.jpg',
            cover: 'https://i.pinimg.com/564x/bc/2a/c5/bc2ac5a137ed215821c75e7de8ad0c41.jpg',
            followers: 0,
            followings: 0,
            listPhotos: [],
            gender: '',
            birthday: new Date(1975, 3, 30),
        },
        theme: themeType.darkTheme,
        language: languageType.en,
        contact: {
            facebook: '',
            email: '',
            phone: '',
        },
    },
    // modeExp
    modeExp: true,
};

const accountSlice = createSlice({
    name: 'accountSlice',
    initialState,
    reducers: {
        updateLogin: (state, action) => {
            state.login = action.payload;
        },

        updateProfile: (state, action) => {
            state.profile = action.payload;
        },

        // set mode experience or not
        setModeExp: (state, action) => {
            state.modeExp = action.payload;
        },
    },
});

export const accountSliceAction = accountSlice.actions;

export default accountSlice.reducer;

/**
 * ----------------------
 */
