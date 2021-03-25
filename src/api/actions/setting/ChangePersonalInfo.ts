/* eslint-disable react-hooks/rules-of-hooks */
import {infoType} from 'asset/name';
import useRedux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';

interface newInfoType {
    info?: {
        gender?: string;
        birthday?: Date;
    };
    contact?: {
        facebook?: any;
        email?: string;
        phone?: string;
    };
}

export default class ChangePersonalInfo {
    private static changeInfoInApp = async (newInfo: newInfoType) => {
        // await FindmeAsyncStorage.editIndexNowAccount(newInfo);
        // not need to Async because Async not save info
        useRedux().updateProfile({
            info: newInfo.info,
            contact: newInfo.contact,
        });
    };

    private static changeInfoInServer = async () => {};

    static changeInfo = async (newInfo: any, typeChange: string) => {
        let temptInfo: newInfoType = {};

        switch (typeChange) {
            case infoType.facebook:
                temptInfo = {contact: {facebook: newInfo}};
                break;
            case infoType.email:
                temptInfo = {contact: {email: newInfo}};
                break;
            case infoType.phone:
                temptInfo = {contact: {phone: newInfo}};
                break;
            case infoType.gender:
                temptInfo = {info: {gender: newInfo}};
                break;
            case infoType.birthday:
                temptInfo = {info: {birthday: newInfo}};
                break;
            default:
                break;
        }
        console.log(temptInfo);

        try {
            await ChangePersonalInfo.changeInfoInServer();
            await ChangePersonalInfo.changeInfoInApp(temptInfo);
            // console.log('new info: ', newInfo);
        } catch (err) {
            appAlert(err);
        }
    };
}
