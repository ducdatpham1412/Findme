import Images from 'asset/img/images';
import Redux from 'hook/useRedux';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {renderIconGender} from 'utility/assistant';
import AuthenticateService from 'utility/login/loginService';
import TypeMainSetting from './components/TypeMainSetting';

/**
 * MAIN_SETTING WILL SEND ACTION TO OTHERS THROW ROUTE PARAMS
 * AND HAS BUTTON LOG OUT
 */
const SettingScreen = () => {
    const theme = Redux.getTheme();

    const logOut = async () => {
        await AuthenticateService.logOut();
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <TypeMainSetting
                icon={Images.icons.security}
                title="setting.component.typeMainSetting.security"
                onPress={() => navigate(SETTING_ROUTE.security)}
            />

            <TypeMainSetting
                icon={renderIconGender()}
                title="setting.component.typeMainSetting.personalInfo"
                onPress={() => navigate(SETTING_ROUTE.personalInformation)}
            />

            <TypeMainSetting
                icon={Images.icons.extend}
                title="setting.component.typeMainSetting.extend"
                onPress={() => navigate(SETTING_ROUTE.setTheme)}
            />

            <TypeMainSetting
                icon={Images.icons.logo}
                title="setting.component.typeMainSetting.aboutFindme"
                onPress={() => navigate(SETTING_ROUTE.aboutFindme)}
            />

            <TypeMainSetting
                icon={Images.icons.logout}
                title="setting.component.typeMainSetting.logOut"
                onPress={logOut}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '20@s',
    },
});

export default SettingScreen;
