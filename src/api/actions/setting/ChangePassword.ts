/* eslint-disable react-hooks/rules-of-hooks */
import useRedux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';

export default class ChangePassword {
    private static changePassInApp = (newPass: string) => {
        useRedux().updateLogin({password: newPass});
        FindmeAsyncStorage.editIndexNowAccount({password: newPass});
    };

    private static changePassInServer = async (newPass: string) => {
        console.log('Change password in server: ', newPass);
    };

    /**
     * Can't use try/catch stand in here like others
     * Because this is use in both ForgetPass and ChangePass
     * Related to Navigate to LoginScreen or not of ForgetPassForm
     */
    static changePassword = async (newPass: string) => {
        await ChangePassword.changePassInServer(newPass);
        await ChangePassword.changePassInApp(newPass);
        appAlert('alert.successChange');
    };
}
