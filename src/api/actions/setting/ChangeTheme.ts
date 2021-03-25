/* eslint-disable react-hooks/rules-of-hooks */
import useRedux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';

export default class ChangeTheme {
    private static changeThemeInApp = async (updateTheme: string) => {
        await FindmeAsyncStorage.editIndexNowAccount({theme: updateTheme});
        useRedux().setTheme(updateTheme);
    };

    private static changeThemeInServer = () => {};

    static changeTheme = async (updateTheme: string) => {
        try {
            await ChangeTheme.changeThemeInServer();
            await ChangeTheme.changeThemeInApp(updateTheme);
            appAlert('alert.successChange');
        } catch (err) {
            appAlert(err);
        }
    };
}
