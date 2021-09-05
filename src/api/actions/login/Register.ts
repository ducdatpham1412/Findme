import Redux from 'hook/useRedux';
import APP_ROUTE from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {logger} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';

export interface accountType {
    // login
    username: string;
    password: string;
    // info
    name: string;
    gender: number;
    birthday: Date;
    avatar: any;
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
        });
    };

    private static registerInServer = async (account: accountType) => {
        logger('register in server: ', account);
    };

    static register = async (account: accountType, rememberAcc: boolean) => {
        const {name, avatar, gender, birthday} = account;

        try {
            await Register.registerInServer(account);
            rememberAcc && (await Register.registerInApp(account));
            Redux.setModeExp(false);
            // not need to update login or contact because it have in signupform screen
            Redux.updatePassport({
                profile: {
                    name,
                    avatar,
                },
                information: {
                    gender,
                    birthday,
                },
            });
            navigate(APP_ROUTE.mainScreen);
        } catch (err) {
            appAlert(err);
        }
    };
}
