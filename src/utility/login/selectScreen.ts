import {apiGetPassport, apiGetResource} from 'api/module';
import Redux from 'hook/useRedux';
import {chooseLanguageFromId} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';

// Is called from RootScreen
export const selectIsHaveActiveUser = async () => {
    const activeUser = await FindmeAsyncStorage.getActiveUser();

    const handleNotHaveActiveUser = async () => {
        await FindmeAsyncStorage.logOut();
        I18Next.changeLanguage(await FindmeAsyncStorage.getLanguageModeExp());
        return;
    };

    if (activeUser?.token) {
        // although activeUser still save in async from last login
        // but "index" not have -> handleNotHaveActiveUser and clear that user
        const index = await FindmeAsyncStorage.getIndexNow();
        if (index === null) {
            await handleNotHaveActiveUser();
            return;
        }

        const passport = await apiGetPassport();
        const resource = await apiGetResource();

        Redux.updatePassport(passport.data);
        // passport must be above token to set in SocketProvider
        Redux.setNumberNewNotifications(passport.data.numberNewNotifications);
        Redux.setToken(activeUser.token);
        Redux.setModeExp(false);
        Redux.updateResource(resource.data);
        I18Next.changeLanguage(
            chooseLanguageFromId(passport.data.setting.language),
        );
    } else {
        await handleNotHaveActiveUser();
    }
};

// Is called from Starter
export const selectIsTheFirstTime = async () => {
    const isFirstTime = await FindmeAsyncStorage.isFirstTimeOpenApp();
    return isFirstTime;
};
