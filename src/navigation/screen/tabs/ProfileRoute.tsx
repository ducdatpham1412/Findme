import {createStackNavigator} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import EditProfile from 'feature/profile/EditProfile';
import MyProfile from 'feature/profile/MyProfile';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';

const ProfileStack = createStackNavigator();

const ProfileRoute = () => {
    const theme = Redux.getTheme();

    return (
        <>
            <ProfileStack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: theme.backgroundColor,
                        paddingTop: Metrics.safeTopPadding,
                    },
                }}>
                <ProfileStack.Screen
                    name={PROFILE_ROUTE.myProfile}
                    component={MyProfile}
                />

                <ProfileStack.Screen
                    name={PROFILE_ROUTE.editProfile}
                    component={EditProfile}
                />
            </ProfileStack.Navigator>
        </>
    );
};

export default ProfileRoute;
