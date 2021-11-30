import {apiGetPassport, apiGetResource, apiLogin, apiLogOut} from 'api/module';
import request from 'api/request';
import FindmeStore from 'app-redux/store';
import Redux from 'hook/useRedux';
import {closeSocket} from 'hook/useSocketIO';
import ROOT_SCREEN, {
    DISCOVERY_ROUTE,
    LOGIN_ROUTE,
} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {chooseLanguageFromId} from 'utility/assistant';
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
            Redux.setIsLoading(true);

            const res = await apiLogin({username, password});

            /**
             * Account is temporary locking
             */
            if (res.data?.isLocking && res.data?.username) {
                navigate(LOGIN_ROUTE.confirmOpenAccount, {
                    username: res.data.username,
                });
                return;
            }

            /**
             * Login success
             */
            if (res.data?.token) {
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
                const temp = chooseLanguageFromId(
                    passport.data.setting.language,
                );
                I18Next.changeLanguage(temp);
                await FindmeAsyncStorage.editLanguageModeExp(temp);

                if (isKeepSign) {
                    await FindmeAsyncStorage.addStorageAcc({
                        username,
                        password,
                    });
                }

                navigate(ROOT_SCREEN.mainScreen, {
                    screen: DISCOVERY_ROUTE.discoveryScreen,
                });
            }
        } catch (err) {
            appAlert('alert.loginFail');
        } finally {
            Redux.setIsLoading(false);
        }
    },

    refreshToken: (inputRefreshToken: string) => {
        request.post(AUTH_URL_REFRESH_TOKEN, {
            refresh_token: inputRefreshToken,
        });
    },

    logOut: async (params: {hadRefreshTokenBlacked: boolean}) => {
        try {
            Redux.setIsLoading(true);
            const isModeExp = FindmeStore.getState().accountSlice.modeExp;
            if (!isModeExp && !params.hadRefreshTokenBlacked) {
                const {refreshToken} = await FindmeAsyncStorage.getActiveUser();
                await apiLogOut(refreshToken || '');
            }
            await FindmeAsyncStorage.logOut();
            Redux.logOut();
            closeSocket();
            navigate(LOGIN_ROUTE.loginScreen);
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    },
};

export default AuthenticateService;
