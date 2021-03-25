/* eslint-disable react-hooks/rules-of-hooks */
import {apiGetProfile} from 'api/module';
import {resource} from 'asset/staticData';
import useRedux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {logger} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';

// Is called from RootScreen
export const selectIsLogged = async () => {
    const Redux = useRedux();
    const isLogged = await FindmeAsyncStorage.getLogged();

    const storageAcc = await FindmeAsyncStorage.getStorageAcc();
    logger(storageAcc);

    if (isLogged) {
        // THIS PART IS USE FOR CHOOSE ACCOUNT WHEN LOGGED IS TRUE
        const index = await FindmeAsyncStorage.getIndexNow();

        const selectedAcc = storageAcc[index];

        const info = await apiGetProfile({
            username: selectedAcc.username,
            password: selectedAcc.password,
        });

        Redux.updateLogin({
            username: selectedAcc.username,
            password: selectedAcc.password,
        });
        Redux.updateProfile(info);
        Redux.setTheme(selectedAcc.theme);
        Redux.setModeExp(false);
        I18Next.changeLanguage(selectedAcc.language);

        Redux.updateResource(resource);

        navigate(ROOT_SCREEN.mainScreen);
    } else {
        I18Next.changeLanguage(await FindmeAsyncStorage.getLanguageModeExp());
        Redux.setIsLoading(false);
    }
};

// Is called from Starter
export const selectIsTheFirstTime = async () => {
    const isFirstTime = await FindmeAsyncStorage.isFirstTimeOpenApp();
    return isFirstTime;
};
