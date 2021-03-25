import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import ProfileScreen from 'feature/profile/ProfileScreen';
import SettingRoute from 'navigation/screen/tabs/SettingRoute';
import EditProfile from 'feature/profile/EditProfile';
import useRedux from 'hook/useRedux';
import {StyleProp} from 'react-native';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {useTranslation} from 'react-i18next';
import {moderateScale} from 'react-native-size-matters';

const ProfileStack = createStackNavigator();

const ProfileRoute: React.FunctionComponent = () => {
    const theme = useRedux().getTheme();
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
                name={PROFILE_ROUTE.profileScreen}
                component={ProfileScreen}
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
