import {apiChangeInformation} from 'api/module';
import FindmeStore from 'app-redux/store';
import {INFO_TYPE} from 'asset/enum';
import Redux from 'hook/useRedux';

interface newInfoType {
    facebook?: any;
    email?: string;
    phone?: string;
    gender?: number;
    birthday?: Date;
}

export default class ChangePersonalInfo {
    private static changeInfoInApp = (newInfo: any) => {
        Redux.updatePassport({
            information: newInfo,
        });
    };

    private static changeInfoInServer = async (newInfo: any) => {
        await apiChangeInformation(newInfo);
    };

    static changeInfo = async (newInfo: any, typeChange: string) => {
        let tempInfo: newInfoType = {};

        switch (typeChange) {
            case INFO_TYPE.facebook:
                tempInfo = {facebook: newInfo};
                break;
            case INFO_TYPE.email:
                tempInfo = {email: newInfo};
                break;
            case INFO_TYPE.phone:
                tempInfo = {phone: newInfo};
                break;
            case INFO_TYPE.gender:
                tempInfo = {gender: newInfo};
                break;
            case INFO_TYPE.birthday:
                tempInfo = {birthday: newInfo};
                break;
            default:
                break;
        }
        const isModeExp = FindmeStore.getState().accountSlice.modeExp;
        if (!isModeExp) {
            await ChangePersonalInfo.changeInfoInServer(tempInfo);
        }
        ChangePersonalInfo.changeInfoInApp(tempInfo);
    };
}
