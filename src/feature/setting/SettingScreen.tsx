import useRedux from 'hook/useRedux';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {AuthenticateService} from 'utility/login/loginService';
import TypeMainSetting from './components/TypeMainSetting';

/**
 * MAIN_SETTING WILL SEND ACTION TO OTHERS THROW ROUTE PARAMS
 * AND HAS BUTTON LOG OUT
 */
const SettingScreen = () => {
    const Redux = useRedux();
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <TypeMainSetting
                type="security"
                onPress={() => navigate(SETTING_ROUTE.security)}
            />

            <TypeMainSetting
                type="personalInfo"
                onPress={() => navigate(SETTING_ROUTE.personalInformation)}
            />

            <TypeMainSetting
                type="extend"
                onPress={() => navigate(SETTING_ROUTE.setTheme)}
            />

            <TypeMainSetting
                type="aboutFindme"
                onPress={() => navigate(SETTING_ROUTE.aboutFindme)}
            />

            <TypeMainSetting
                type="logOut"
                onPress={() => AuthenticateService.logOut()}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '25@s',
    },
});

export default SettingScreen;
