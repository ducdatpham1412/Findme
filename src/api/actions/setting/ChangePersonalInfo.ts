import {apiChangeInformation} from 'api/module';
import {infoType} from 'asset/enum';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';

interface newInfoType {
    facebook?: any;
    email?: string;
    phone?: string;
    gender?: number;
    birthday?: Date;
}

export default class ChangePersonalInfo {
    private static changeInfoInApp = async (newInfo: any) => {
        // await FindmeAsyncStorage.editIndexNowAccount(newInfo);
        // not need to Async because Async not save info
        Redux.updatePassport({
            information: newInfo,
        });
    };

    private static changeInfoInServer = async (newInfo: any) => {
        apiChangeInformation(newInfo);
    };

    static changeInfo = async (newInfo: any, typeChange: string) => {
        let tempInfo: newInfoType = {};

        switch (typeChange) {
            case infoType.facebook:
                tempInfo = {facebook: newInfo};
                break;
            case infoType.email:
                tempInfo = {email: newInfo};
                break;
            case infoType.phone:
                tempInfo = {phone: newInfo};
                break;
            case infoType.gender:
                tempInfo = {gender: newInfo};
                break;
            case infoType.birthday:
                tempInfo = {birthday: newInfo};
                break;
            default:
                break;
        }

        try {
            await ChangePersonalInfo.changeInfoInServer(tempInfo);
            await ChangePersonalInfo.changeInfoInApp(tempInfo);
        } catch (err) {
            appAlert(err);
        }
    };
}
