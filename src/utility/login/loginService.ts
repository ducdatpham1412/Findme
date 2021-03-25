/*eslint-disable react-hooks/rules-of-hooks */
import {apiGetProfile} from 'api/module';
import request from 'api/request';
import useRedux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import FindmeAsyncStorage, {
    AccountSaveToAsync,
} from 'utility/FindmeAsyncStorage';

const AUTH_URL_REFRESH_TOKEN = '/refreshToken';

export const requestLogin = async (
    username: string,
    password: string,
    isKeepSign: boolean,
) => {
    const Redux = useRedux();

    const onKeepSignIn = async (account: AccountSaveToAsync) => {
        await FindmeAsyncStorage.addStorageAcc(account);
        await FindmeAsyncStorage.setLogged(true);
    };

    try {
        // get from API
        const profile = await apiGetProfile({username, password});

        Redux.updateLogin({
            username,
            password,
        });
        Redux.updateProfile(profile);

        if (isKeepSign) {
            await onKeepSignIn({
                username,
                password,
                theme: profile.theme,
                language: profile.language,
            });
        }

        Redux.setModeExp(false);

        navigate(ROOT_SCREEN.mainScreen);
    } catch (err) {
        appAlert(err);
    }
};

export const AuthenticateService = {
    refreshToken: (inputRefreshToken: string) => {
        request.post(AUTH_URL_REFRESH_TOKEN, {
            refresh_token: inputRefreshToken,
        });
    },

    logOut: async () => {
        await FindmeAsyncStorage.logOut();
        useRedux().setModeExp(true);
        navigate(LOGIN_ROUTE.loginScreen);
    },
};
