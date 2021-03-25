import {apiChangeLanguage} from 'api/module';
import {appAlert} from 'navigation/NavigationService';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';

export default class ChangeLanguage {
    private static changeLanguageInApp = async (updateLanguage: string) => {
        await FindmeAsyncStorage.editIndexNowAccount({
            language: updateLanguage,
        });
        await FindmeAsyncStorage.editLanguageModeExp(updateLanguage);
        I18Next.changeLanguage(updateLanguage);
    };

    private static changeLanguageInServer = async () => {
        await apiChangeLanguage();
    };

    static changeLanguage = async (updateLanguage: string) => {
        try {
            await ChangeLanguage.changeLanguageInServer();
            await ChangeLanguage.changeLanguageInApp(updateLanguage);
            appAlert('alert.successChange');
        } catch (err) {
            appAlert(err);
        }
    };
}
