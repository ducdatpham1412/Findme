import {NavigationContainer} from '@react-navigation/native';
import {
    CardStyleInterpolators,
    createStackNavigator,
    StackNavigationOptions,
} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import Alert from 'components/Alert';
import AlertYesNo from 'components/AlerYesNo';
import StylePicker from 'components/base/picker/StylePicker';
import Modalize from 'components/common/useModalize';
import LoadingScreen from 'components/LoadingScreen';
import SwipeImages from 'components/SwipeImages';
import DetailBubble from 'feature/discovery/DetailBubble';
import InteractBubble from 'feature/discovery/InteractBubble';
import ReportUser from 'feature/discovery/ReportUser';
import ListFollows from 'feature/profile/ListFollows';
import OtherProfile from 'feature/profile/OtherProfile';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import TabBarProvider from 'navigation/config/TabBarProvider';
import {navigationRef} from 'navigation/NavigationService';
import React, {useEffect} from 'react';
import {StatusBar, StyleProp, ViewStyle} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {isIOS, logger, selectBgCardStyle} from 'utility/assistant';
import {selectIsHaveActiveUser} from 'utility/login/selectScreen';
import LoginRoute from './LoginRoute';
import MainTabs from './MainTabs';
import WebViewScreen from './WebViewScreen';

const RootStack = createStackNavigator();

const RootScreen = () => {
    const isLoading = Redux.getIsLoading();
    const theme = Redux.getTheme();
    const barStyle =
        theme === Theme.darkTheme ? 'light-content' : 'dark-content';

    const initApp = async () => {
        try {
            await selectIsHaveActiveUser();
        } catch (err) {
            logger(err);
        } finally {
            SplashScreen.hide();
            Redux.setIsLoading(false);
        }
    };

    const checkUpdate = async () => {
        if (!__DEV__) {
            CodePush.sync({
                updateDialog: undefined,
                installMode: CodePush.InstallMode.IMMEDIATE,
                deploymentKey: isIOS
                    ? Config.CODEPUSH_IOS_KEY
                    : Config.CODEPUSH_ANDROID_KEY,
            });
        }
        initApp();
    };

    useEffect(() => {
        checkUpdate();
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <TabBarProvider>
                <StatusBar barStyle={barStyle} />
                <SafeAreaView
                    style={{
                        flex: 1,
                        overflow: 'visible',
                        backgroundColor: theme.backgroundColor,
                    }}
                    edges={['bottom', 'left', 'right']}>
                    <RootStack.Navigator
                        screenOptions={{
                            gestureEnabled: false,
                            headerShown: false,
                        }}>
                        {/* Authentication */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.loginRoute}
                            component={LoginRoute}
                            options={{
                                cardStyle: [
                                    cardStyleSafeTop,
                                    {backgroundColor: theme.backgroundColor},
                                ],
                            }}
                        />

                        {/* Main Tabs */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.mainScreen}
                            component={MainTabs}
                            options={{
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forHorizontalIOS,
                            }}
                        />
                        <RootStack.Screen
                            name={ROOT_SCREEN.otherProfile}
                            component={OtherProfile}
                            options={{
                                cardStyle: [
                                    cardStyleSafeTop,
                                    {backgroundColor: theme.backgroundColor},
                                ],
                            }}
                        />
                        <RootStack.Screen
                            name={ROOT_SCREEN.listFollows}
                            component={ListFollows}
                            options={{
                                cardStyle: [
                                    cardStyleSafeTop,
                                    {backgroundColor: theme.backgroundColor},
                                ],
                            }}
                        />

                        <RootStack.Screen
                            name={ROOT_SCREEN.detailBubble}
                            component={DetailBubble}
                            options={{
                                cardStyle: [
                                    cardStyleSafeTop,
                                    {backgroundColor: theme.backgroundColor},
                                ],
                                gestureEnabled: true,
                            }}
                        />

                        {/* Alert */}
                        <RootStack.Screen
                            options={{
                                ...alertOption,
                                cardStyle: {
                                    backgroundColor: selectBgCardStyle(0.6),
                                },
                            }}
                            name={ROOT_SCREEN.alert}
                            component={Alert}
                        />
                        {/* Alert yes no */}
                        <RootStack.Screen
                            options={{
                                ...alertOption,
                                cardStyle: {
                                    backgroundColor: selectBgCardStyle(0.6),
                                },
                            }}
                            name={ROOT_SCREEN.alertYesNo}
                            component={AlertYesNo}
                        />

                        {/* Modalize */}
                        <RootStack.Screen
                            options={{
                                ...alertOption,
                                cardStyle: [
                                    {backgroundColor: selectBgCardStyle(0.6)},
                                    cardStyleSafeTop,
                                ],
                            }}
                            name={ROOT_SCREEN.modalize}
                            component={Modalize}
                        />

                        {/* Interact Bubble */}
                        <RootStack.Screen
                            options={{
                                cardStyle: [
                                    {backgroundColor: selectBgCardStyle(0.3)},
                                    cardStyleSafeTop,
                                ],
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forFadeFromBottomAndroid,
                            }}
                            name={ROOT_SCREEN.interactBubble}
                            component={InteractBubble}
                        />

                        {/* Swipe Image */}
                        <RootStack.Screen
                            options={{
                                cardStyle: [
                                    {backgroundColor: theme.backgroundColor},
                                    cardStyleSafeTop,
                                ],
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forFadeFromBottomAndroid,
                            }}
                            name={ROOT_SCREEN.swipeImages}
                            component={SwipeImages}
                        />

                        {/* Report user */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.reportUser}
                            component={ReportUser}
                            options={{
                                cardStyle: [
                                    {backgroundColor: theme.backgroundColor},
                                    cardStyleSafeTop,
                                ],
                            }}
                        />

                        {/* Web view */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.webView}
                            component={WebViewScreen}
                            options={{
                                cardStyle: [
                                    {backgroundColor: theme.backgroundColor},
                                    cardStyleSafeTop,
                                ],
                            }}
                        />

                        {/* Picker */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.picker}
                            component={StylePicker}
                            options={{
                                cardStyle: [
                                    {backgroundColor: selectBgCardStyle(0.6)},
                                    cardStyleSafeTop,
                                ],
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forFadeFromBottomAndroid,
                            }}
                        />
                    </RootStack.Navigator>

                    {/* For loading all app */}
                    {isLoading && <LoadingScreen />}
                </SafeAreaView>
            </TabBarProvider>
        </NavigationContainer>
    );
};

const alertOption: StackNavigationOptions = {
    animationEnabled: false,
    cardOverlayEnabled: true,
    headerShown: false,
};

export const cardStyleSafeTop: StyleProp<ViewStyle> = {
    paddingTop: Metrics.safeTopPadding,
};

export default RootScreen;
