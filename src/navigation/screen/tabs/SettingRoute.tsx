import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import ExtendSetting from 'feature/setting/extend/ExtendSetting';
import AboutFindme from 'feature/setting/findmeAbout/AboutFindme';
import PersonalInformation from 'feature/setting/personalInfo/PersonalInformation';
import SecurityAndLogin from 'feature/setting/security/SecurityAndLogin';
import SettingScreen from 'feature/setting/SettingScreen';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {SETTING_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const SettingStack = createStackNavigator();

const SettingRoute = () => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();
    const optionStyle: StyleProp<any> = {
        headerTintColor: theme.textColor,
        // headerTintColor: 'white',
        headerTitleStyle: {
            fontSize: moderateScale(20),
            fontWeight: 'bold',
        },
        headerStyle: {
            backgroundColor: theme.backgroundColor,
        },
    };

    return (
        <SettingStack.Navigator
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerLeft: (props: any) => <HeaderLeftIcon {...props} />,
            }}>
            <SettingStack.Screen
                name={SETTING_ROUTE.settingScreen}
                component={SettingScreen}
                options={{
                    ...optionStyle,
                    headerTitle: t('setting.settingScreen.headerTitle'),
                }}
            />

            {/* SECURITY AND LOGIN */}
            <SettingStack.Screen
                options={{
                    ...optionStyle,
                    headerTitle: t('setting.securityAndLogin.headerTitle'),
                }}
                name={SETTING_ROUTE.security}
                component={SecurityAndLogin}
            />

            {/* PERSONAL INFORMATION */}
            <SettingStack.Screen
                options={{
                    ...optionStyle,
                    headerTitle: t('setting.personalInfo.headerTitle'),
                }}
                name={SETTING_ROUTE.personalInformation}
                component={PersonalInformation}
            />

            {/* EXTEND SETTING */}
            <SettingStack.Screen
                options={{
                    ...optionStyle,
                    headerTitle: t('setting.extendSetting.headerTitle'),
                }}
                name={SETTING_ROUTE.setTheme}
                component={ExtendSetting}
            />

            {/* ABOUT FIND ME */}
            <SettingStack.Screen
                options={{
                    ...optionStyle,
                    headerTitle: t('setting.aboutUs.headerTitle'),
                }}
                name={SETTING_ROUTE.aboutFindme}
                component={AboutFindme}
            />
        </SettingStack.Navigator>
    );
};

export default SettingRoute;
