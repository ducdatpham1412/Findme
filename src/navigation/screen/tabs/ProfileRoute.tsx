import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import MyProfile from 'feature/profile/MyProfile';
import SettingRoute from 'navigation/screen/tabs/SettingRoute';
import EditProfile from 'feature/profile/EditProfile';
import Redux from 'hook/useRedux';
import {StyleProp} from 'react-native';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {useTranslation} from 'react-i18next';
import {moderateScale} from 'react-native-size-matters';
import OtherProfile from 'feature/profile/OtherProfile';

const ProfileStack = createStackNavigator();

const ProfileRoute: React.FunctionComponent = () => {
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
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <ProfileStack.Screen
                name={PROFILE_ROUTE.myProfile}
                component={MyProfile}
            />

            <ProfileStack.Screen
                name={PROFILE_ROUTE.otherProfile}
                component={OtherProfile}
            />

            <ProfileStack.Screen
                name={PROFILE_ROUTE.editProfile}
                component={EditProfile}
                options={{
                    headerShown: true,
                    ...optionStyle,
                    headerLeft: (props: any) => <HeaderLeftIcon {...props} />,
                    headerTitle: t('profile.edit.headerTitle'),
                }}
            />

            <ProfileStack.Screen
                name={PROFILE_ROUTE.settingRoute}
                component={SettingRoute}
            />
        </ProfileStack.Navigator>
    );
};

export default ProfileRoute;
