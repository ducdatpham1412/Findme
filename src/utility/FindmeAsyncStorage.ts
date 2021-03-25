import {asyncType, languageType} from './../asset/name';
import AsyncStorage from '@react-native-async-storage/async-storage';

// THINK TO SAVE TO ASYNC
// 0. firstTimeOpenApp
// 1. account = {
//     username,
//     password,
//     theme: 'darkTheme',
//     language: 'vi',
// };
// 2. logged
// 3. index
// 4. language: this is for no Account Mode in order to keep language even not sign in
//    it will change follow {account.language}

export interface AccountSaveToAsync {
    username: string;
    password: string;
    theme: string;
    language: string;
}
interface NewInfoType {
    username?: string;
    password?: string;
    theme?: string;
    language?: string;
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
     *  Related to get, add, delete or edit account
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
        // console.log('Temp ne: \n', tempt);
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

    static editIndexNowAccount = async (newInfo: NewInfoType) => {
        const listAccount = await FindmeAsyncStorage.getStorageAcc();
        const indexNow = await FindmeAsyncStorage.getIndexNow();
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
     *   Edit language for Mode No Account
     */
    static getLanguageModeExp = async () => {
        const tempt = await AsyncStorage.getItem(asyncType.language);
        if (!tempt) {
            await AsyncStorage.setItem(asyncType.language, languageType.en);
            return languageType.en;
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
     * Index now is the index of logged acc in async accounts
     */
    static getIndexNow = async () => {
        const index = (await AsyncStorage.getItem(asyncType.index)) || '-1';
        return parseInt(index, 10);
    };
    static setIndexNow = async (value: number) => {
        await AsyncStorage.setItem(asyncType.index, value.toString());
    };
    /**
     * ---------------------------------------------
     */

    /**
     * Logged to help go direct to app not to login form
     */
    static getLogged = async () => {
        const logged = await AsyncStorage.getItem(asyncType.logged);
        if (logged === 'true') {
            return true;
        } else if (logged === 'false') {
            return false;
        } else {
            return;
        }
    };
    static setLogged = async (value: boolean) => {
        if (value === true) {
            await AsyncStorage.setItem(asyncType.logged, 'true');
        } else if (value === false) {
            await AsyncStorage.setItem(asyncType.logged, 'false');
        }
    };
    /**
     * ---------------------------------------------
     */

    // when click log out, will set logged = 'false' and indexNow='-1'
    static logOut = async () => {
        await AsyncStorage.setItem(asyncType.logged, 'false');
        await AsyncStorage.removeItem(asyncType.index);
    };

    // clear all
    static clearAll = async () => {
        await AsyncStorage.clear();
    };
}
