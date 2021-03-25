/* eslint-disable react-hooks/rules-of-hooks */
import {accountSliceAction} from 'app-redux/account/accountSlice';
import {logicSliceAction} from 'app-redux/account/logicSlice';
import FindmeStore, {RootState} from 'app-redux/store';
import {themeType} from 'asset/name';
import Theme from 'asset/theme/Theme';
import {useSelector} from 'react-redux';

interface LoginType {
    username?: string;
    password?: string;
    token?: string;
    refreshToken?: string;
}
interface ProfileType {
    info?: {
        name?: string;
        description?: string;
        avatar?: string;
        cover?: string;
        followers?: number;
        followings?: number;
        listPhotos?: Array<any>;
        gender?: string;
        birthday?: Date;
    };
    theme?: string;
    language?: string;
    contact?: {
        facebook?: any;
        email?: string;
        phone?: string;
    };
}

const useRedux = () => {
    /**
     * IN LOGIC APP SLICE
     */
    const getIsLoading = (): boolean =>
        useSelector((state: RootState) => state.logicSlice.isLoading);

    const getResource = () =>
        useSelector((state: RootState) => state.logicSlice.resource);

    // SET METHOD
    const setIsLoading = (status: boolean) => {
        FindmeStore.dispatch(logicSliceAction.setIsLoading(status));
    };

    const updateResource = (update: Object) => {
        const newResource = {
            ...FindmeStore.getState().logicSlice.resource,
            ...update,
        };
        FindmeStore.dispatch(logicSliceAction.setResource(newResource));
    };

    /**
     * IN ACCOUNT SLICE
     */
    const getLogin = () => FindmeStore.getState().accountSlice.login;

    // token
    const getToken = () => FindmeStore.getState().accountSlice.login.token;
    const getRefreshToken = () =>
        FindmeStore.getState().accountSlice.login.refreshToken;

    const getProfile = (): ProfileType =>
        useSelector((state: RootState) => state.accountSlice.profile);
    const getProfileOutCpn = () => FindmeStore.getState().accountSlice.profile;

    const getTheme = () =>
        useSelector((state: RootState) => state.accountSlice.profile.theme) ===
        themeType.darkTheme
            ? Theme.darkTheme
            : Theme.lightTheme;

    const getModeExp = () => FindmeStore.getState().accountSlice.modeExp;

    // SET METHOD
    const updateLogin = (update: LoginType) => {
        const {username, password, token, refreshToken} =
            FindmeStore.getState().accountSlice.login;
        FindmeStore.dispatch(
            accountSliceAction.updateLogin({
                username: update?.username || username,
                password: update?.password || password,
                token,
                refreshToken,
            }),
        );
    };

    // token
    const setNewToken = (updateToken: string) => {
        const {username, password, refreshToken} =
            FindmeStore.getState().accountSlice.login;
        FindmeStore.dispatch(
            accountSliceAction.updateLogin({
                username,
                password,
                token: updateToken,
                refreshToken,
            }),
        );
    };
    const clearToken = () => {
        FindmeStore.dispatch(accountSliceAction.updateLogin({}));
    };

    // profile
    const updateProfile = (newProfile: ProfileType) => {
        const current = getProfileOutCpn();
        const temp: ProfileType = {
            info: {...current.info, ...newProfile.info},
            theme: newProfile.theme || current.theme,
            language: newProfile.language || current.language,
            contact: {...current.contact, ...newProfile.contact},
        };
        FindmeStore.dispatch(accountSliceAction.updateProfile(temp));
    };

    const setTheme = (updateTheme: string) => {
        updateProfile({theme: updateTheme});
    };

    const setModeExp = (value: boolean) => {
        FindmeStore.dispatch(accountSliceAction.setModeExp(value));
    };

    return {
        // set
        getIsLoading,
        getLogin,
        getToken,
        getRefreshToken,
        getProfile,
        getProfileOutCpn,
        getTheme,
        getModeExp,
        getResource,
        // get
        setIsLoading,
        updateLogin,
        clearToken,
        setNewToken,
        updateProfile,
        setTheme,
        setModeExp,
        updateResource,
    };
};

export default useRedux;
