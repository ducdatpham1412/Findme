/* eslint-disable react-hooks/rules-of-hooks */
import useRedux, {ProfileType} from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';

export default class UpdateProfile {
    private static updateInApp = (newProfile: any) => {
        useRedux().updateProfile(newProfile);
    };

    private static updateInSever = async (newProfile: any) => {
        console.log('Updated profile in Server', newProfile);
    };

    static updateProfile = async (newProfile: ProfileType) => {
        try {
            await UpdateProfile.updateInSever(newProfile);
            UpdateProfile.updateInApp(newProfile);
            appAlert('alert.successUpdatePro');
        } catch (err) {
            appAlert(err);
        }
    };
}
