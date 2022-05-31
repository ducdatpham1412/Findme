import {createStackNavigator} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import {StyleText} from 'components/base';
import CreateGroup from 'feature/profile/CreateGroup';
import EditProfile from 'feature/profile/EditProfile';
import MyProfile from 'feature/profile/MyProfile';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

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
                        paddingTop: Metrics.tabBarUp,
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

            <View style={styles.headerView}>
                <StyleText
                    originValue="DOFFY"
                    customStyle={[styles.doffyText, {color: theme.borderColor}]}
                />
            </View>
        </>
    );
};

const styles = ScaledSheet.create({
    headerView: {
        position: 'absolute',
        top: moderateScale(10),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    doffyText: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
});

export default ProfileRoute;
