import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import TopTabNavigator from 'navigation/components/TopTabNavigator';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import ChoosingLoginOrEnjoy from './ChoosingLoginOrEnjoy';
import BackgroundAuthen from './components/BackgroundAuthen';
import LoginScreen from './LoginScreen';
import SignUpForm from './signUp/SignUpForm';

const TopTab = createMaterialTopTabNavigator();

const Starter = () => {
    return (
        <View style={styles.container}>
            <BackgroundAuthen />

            <View style={styles.spaceView} />

            <TopTab.Navigator
                tabBar={(props: MaterialTopTabBarProps) => (
                    <TopTabNavigator
                        materialProps={props}
                        containerStyle={styles.tabBarContainer}
                        listRouteName={[
                            'login.enjoy',
                            'login.login',
                            'login.register',
                        ]}
                        titleStyle={styles.titleTabBar}
                    />
                )}
                sceneContainerStyle={styles.sceneContainer}
                initialRouteName={LOGIN_ROUTE.loginScreen}>
                <TopTab.Screen
                    name={LOGIN_ROUTE.choosingLoginOrEnjoy}
                    component={ChoosingLoginOrEnjoy}
                    options={{lazy: true}}
                />
                <TopTab.Screen
                    name={LOGIN_ROUTE.loginScreen}
                    component={LoginScreen}
                />
                <TopTab.Screen
                    name={LOGIN_ROUTE.signUpForm}
                    component={SignUpForm}
                    options={{lazy: true}}
                />
            </TopTab.Navigator>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    spaceView: {
        width: '100%',
        height: Metrics.safeTopPadding + verticalScale(10),
    },
    tabBarContainer: {
        width: '90%',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    sceneContainer: {
        backgroundColor: 'transparent',
    },
    titleTabBar: {
        color: Theme.common.comment,
    },
});

export default Starter;
