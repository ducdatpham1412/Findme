import {apiEditProfile} from 'api/module';
import Redux, {PassportType} from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import ImageUploader from 'utility/upload/ImageUploader';

export default class UpdateProfile {
    private static updateInApp = (newProfile: any) => {
        Redux.updatePassport(newProfile);
    };

    private static updateInSever = async (newProfile: PassportType) => {
        const listImg = await ImageUploader.upLoadManyImg([
            newProfile.profile?.avatar,
            newProfile.profile?.cover,
        ]);
        await apiEditProfile({
            avatar: listImg[0],
            cover: listImg[1],
            name: newProfile.profile?.name || '',
            description: newProfile.profile?.description || '',
        });
    };

    static updatePassport = async (newProfile: PassportType) => {
        const isModeExp = Redux.getModeExp();

        try {
            if (!isModeExp) {
                await UpdateProfile.updateInSever(newProfile);
            }
            UpdateProfile.updateInApp(newProfile);
            appAlert('alert.successUpdatePro', () =>
                navigate(PROFILE_ROUTE.myProfile),
            );
        } catch (err) {
            appAlert(err);
        }
    };
}
