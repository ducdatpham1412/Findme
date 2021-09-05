import AsyncStorage from '@react-native-async-storage/async-storage';
import {asyncType} from '../asset/enum';

// THINK TO SAVE TO ASYNC
// 0. firstTimeOpenApp
// 1. storageAcc = []: {
//     username,
//     password,
//     theme: 0,
//     language: 'vi',
// };
// 2. user :{
//    - username
//    - password
//    - token
//    - refreshToken
//    }
// 3. index
// 4. language: this is for no Account Mode in order to keep language even not sign in, it will change follow {account.language}

export interface AccountSaveToAsync {
    username?: string;
    password?: string;
}

interface ActiveUserType {
    username?: string;
    password?: string;
    token?: string;
    refreshToken?: string;
}
export default class FindmeAsyncStorage {
    /**
     * First time open app
     */
    static isFirstTimeOpenApp = async () => {
        const tempt = await AsyncStorage.getItem(asyncType.firstTimeOpenApp);
        if (tempt === null) {
            await AsyncStorage.setItem(asyncType.firstTimeOpenApp, 'true');
            return true;
        }
        return false;
    };

    /**
     *  GET, ADD, DELETE OR EDIT LIST STORAGE ACCOUNT
     */
    // return to Array of object of AccountSaveToAsync
    static getStorageAcc = async () => {
        let result: Array<AccountSaveToAsync> = [];
        const tempt = await AsyncStorage.getItem(asyncType.storageAcc);
        if (tempt !== null) {
            tempt.split('},{').map(item => {
                if (item[0] !== '{') {
                    item = '{'.concat(item);
                }
                if (item[item.length - 1] !== '}') {
                    item = item.concat('}');
                }
                const itemJson = JSON.parse(item);
                result.push(itemJson);
            });
        }
        return result;
    };
    static getStorageAccAtIndex = async (index: number) => {
        // remember switch from string to date
    };
    static addStorageAcc = async (account: AccountSaveToAsync) => {
        let tempt = await FindmeAsyncStorage.getStorageAcc();
        for (let i = 0; i < tempt.length; i++) {
            if (tempt[i].username === account.username) {
                FindmeAsyncStorage.setIndexNow(i);
                return;
            }
        }

        const result: Array<any> = [];
        tempt.forEach(item => result.push(JSON.stringify(item)));
        result.push(JSON.stringify(account));
        await AsyncStorage.setItem(asyncType.storageAcc, result.toString());
        await FindmeAsyncStorage.setIndexNow(result.length - 1);
    };

    static editIndexNowAccount = async (newInfo: AccountSaveToAsync) => {
        const indexNow = await FindmeAsyncStorage.getIndexNow();
        if (indexNow === null) {
            return;
        }

        const listAccount = await FindmeAsyncStorage.getStorageAcc();
        listAccount[indexNow] = {...listAccount[indexNow], ...newInfo};
        let result: Array<any> = [];
        listAccount.forEach(item => result.push(JSON.stringify(item)));
        await AsyncStorage.setItem(asyncType.storageAcc, result.toString());
    };

    static deleteAccAtIndex = async (index: number) => {
        const listAccount = await FindmeAsyncStorage.getStorageAcc();
        listAccount.splice(index, 1);

        const result: Array<any> = [];
        listAccount.forEach(item => result.push(JSON.stringify(item)));
        await AsyncStorage.setItem(asyncType.storageAcc, result.toString());
    };
    /**
     * ---------------------------------------------
     */
    /**
     *  ACTIVE USER
     */
    static getActiveUser = async (): Promise<ActiveUserType> => {
        const temp = await AsyncStorage.getItem(asyncType.activeUser);
        if (temp === null) {
            return {};
        }
        return JSON.parse(temp);
    };
    static updateActiveUser = async (params: ActiveUserType) => {
        const activeUser = await this.getActiveUser();
        const newUser = {
            ...activeUser,
            ...params,
        };
        await AsyncStorage.setItem(
            asyncType.activeUser,
            JSON.stringify(newUser),
        );
    };
    /**
     *   Edit language for Mode No Account
     */
    static getLanguageModeExp = async () => {
        const tempt = await AsyncStorage.getItem(asyncType.language);

        if (!tempt) {
            await AsyncStorage.setItem(asyncType.language, 'en');
            return 'en';
        }
        return tempt;
    };
    static editLanguageModeExp = async (updateLanguage: string) => {
        await AsyncStorage.setItem(asyncType.language, updateLanguage);
    };
    /**
     * ---------------------------------------------
     */

    /**
     * Index of logged acc in async accounts
     */
    static getIndexNow = async () => {
        const index = await AsyncStorage.getItem(asyncType.index);
        if (index === null) {
            return null;
        }
        return parseInt(index, 10);
    };
    static setIndexNow = async (value: number) => {
        await AsyncStorage.setItem(asyncType.index, value.toString());
    };
    /**
     * ---------------------------------------------
     */

    // when click log out, will set logged = 'false' and indexNow='-1'
    static logOut = async () => {
        await AsyncStorage.removeItem(asyncType.activeUser);
        await AsyncStorage.removeItem(asyncType.index);
    };

    // clear all
    static clearAll = async () => {
        await AsyncStorage.clear();
    };
}
