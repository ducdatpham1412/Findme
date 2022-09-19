import {Metrics} from 'asset/metrics';
import DetailGroupBuying from 'feature/discovery/DetailGroupBuying';
import EditProfile from 'feature/profile/EditProfile';
import MyProfile from 'feature/profile/MyProfile';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const ProfileStack = createSharedElementStackNavigator();

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

                <ProfileStack.Screen
                    name={PROFILE_ROUTE.detailGroupBuying}
                    component={DetailGroupBuying}
                    sharedElementsConfig={route => {
                        return [`item.group_buying.${route.params.item.id}`];
                    }}
                />
            </ProfileStack.Navigator>
        </>
    );
};

export default ProfileRoute;
