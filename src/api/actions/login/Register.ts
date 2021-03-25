/* eslint-disable react-hooks/rules-of-hooks */
import {languageType, themeType} from 'asset/name';
import useRedux from 'hook/useRedux';
import APP_ROUTE from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';

export interface accountType {
    // login
    username: string;
    password: string;
    // info
    name: string;
    gender: string;
    birthday: Date;
    //contact
    facebook: any;
    email: string;
    phone: string;
}
export default class Register {
    private static registerInApp = async (account: accountType) => {
        await FindmeAsyncStorage.addStorageAcc({
            username: account.username,
            password: account.password,
            theme: themeType.darkTheme, // default
            language: languageType.en, // default
        });
        await FindmeAsyncStorage.setLogged(true);
    };

    private static registerInServer = async (account: accountType) => {
        console.log('register in server: ', account);
    };

    static register = async (account: accountType, rememberAcc: boolean) => {
        const {name, gender, birthday} = account;

        try {
            await Register.registerInServer(account);
            rememberAcc && (await Register.registerInApp(account));
            useRedux().setModeExp(false);
            useRedux().updateProfile({info: {name, gender, birthday}});
            navigate(APP_ROUTE.mainScreen);
        } catch (err) {
            appAlert(err);
        }
    };
}
