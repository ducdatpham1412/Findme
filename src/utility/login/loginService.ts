import {apiGetPassport, apiGetResource, apiLogin, apiLogOut} from 'api/module';
import request from 'api/request';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {chooseLanguageFromId, logger} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';

const AUTH_URL_REFRESH_TOKEN = '/refreshToken';

interface requestLoginParams {
    username: string;
    password: string;
    isKeepSign: boolean;
}

const AuthenticateService = {
    requestLogin: async (params: requestLoginParams) => {
        const {username, password, isKeepSign} = params;

        try {
            const res = await apiLogin({username, password});
            await FindmeAsyncStorage.updateActiveUser({
                username,
                password,
                token: res.data.token,
                refreshToken: res.data.refreshToken,
            });

            const passport = await apiGetPassport();
            const resource = await apiGetResource();

            Redux.updatePassport(passport.data);
            // passport must be above token to set in SocketProvider
            Redux.setToken(res.data.token);
            Redux.updateResource(resource.data);
            Redux.setModeExp(false);
            Redux.setTheme(passport.data.setting.theme);
            const temp = chooseLanguageFromId(passport.data.setting.language);
            I18Next.changeLanguage(temp);
            await FindmeAsyncStorage.editLanguageModeExp(temp);

            if (isKeepSign) {
                await FindmeAsyncStorage.addStorageAcc({
                    username,
                    password,
                });
            }

            navigate(ROOT_SCREEN.mainScreen);
        } catch (err) {
            logger(err);
            appAlert('alert.loginFail');
        }
    },

    refreshToken: (inputRefreshToken: string) => {
        request.post(AUTH_URL_REFRESH_TOKEN, {
            refresh_token: inputRefreshToken,
        });
    },

    logOut: async () => {
        try {
            const idModeExp = Redux.getModeExp();
            if (!idModeExp) {
                const {refreshToken} = await FindmeAsyncStorage.getActiveUser();
                await apiLogOut(refreshToken || '');
            }
            await FindmeAsyncStorage.logOut();
            Redux.logOut();
            navigate(LOGIN_ROUTE.loginScreen);
        } catch (err) {
            appAlert(err);
        }
    },
};

export default AuthenticateService;
