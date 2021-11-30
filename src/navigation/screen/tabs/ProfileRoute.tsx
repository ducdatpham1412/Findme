import {createStackNavigator} from '@react-navigation/stack';
import CreatePost from 'feature/profile/CreatePost';
import EditProfile from 'feature/profile/EditProfile';
import ListFollows from 'feature/profile/ListFollows';
import MyProfile from 'feature/profile/MyProfile';
import OtherProfile from 'feature/profile/OtherProfile';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import SettingRoute from 'navigation/screen/tabs/SettingRoute';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const ProfileStack = createStackNavigator();

const ProfileRoute = () => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();

    const optionStyle: StyleProp<any> = {
        headerTintColor: theme.textColor,
        // headerTintColor: 'white',
        headerTitleStyle: {
            fontSize: moderateScale(17),
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

            <ProfileStack.Screen
                name={PROFILE_ROUTE.createPost}
                component={CreatePost}
            />

            <ProfileStack.Screen
                name={PROFILE_ROUTE.listFollows}
                component={ListFollows}
            />
        </ProfileStack.Navigator>
    );
};

export default ProfileRoute;
