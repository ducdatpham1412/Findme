import {NavigationContainer} from '@react-navigation/native';
import {
    CardStyleInterpolators,
    createStackNavigator,
    StackNavigationOptions,
} from '@react-navigation/stack';
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
import ChatDetail from 'feature/mess/ChatDetail';
import ChatDetailGroup from 'feature/mess/ChatDetailGroup';
import ChatDetailSetting from 'feature/mess/ChatDetailSetting';
import PublicChatting from 'feature/mess/PublicChatting';
import CreateGroup from 'feature/profile/CreateGroup';
import CreatePostPreview from 'feature/profile/CreatePostPreview';
import ListFollows from 'feature/profile/ListFollows';
import OtherProfile from 'feature/profile/OtherProfile';
import ListDetailPost from 'feature/profile/post/ListDetailPost';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {MESS_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import TabBarProvider from 'navigation/config/TabBarProvider';
import {navigationRef} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {isIOS, logger, selectBgCardStyle} from 'utility/assistant';
import {selectIsHaveActiveUser} from 'utility/login/selectScreen';
import LoginRoute from './LoginRoute';
import MainTabs from './MainTabs';
import SettingRoute from './tabs/SettingRoute';
import WebViewScreen from './WebViewScreen';

const RootStack = createStackNavigator();

const RootScreen = () => {
    const isLoading = Redux.getIsLoading();
    const theme = Redux.getTheme();
    const barStyle =
        theme === Theme.darkTheme ? 'light-content' : 'dark-content';
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    const [initLoading, setInitLoading] = useState(true);

    const cardStyle = {
        backgroundColor: theme.backgroundColor,
    };

    const initApp = async () => {
        try {
            await selectIsHaveActiveUser();
        } catch (err) {
            logger(err);
        } finally {
            SplashScreen.hide();
            setInitLoading(false);
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

    const RenderAuthenticationStack = () => {
        return (
            <RootStack.Screen
                name={ROOT_SCREEN.loginRoute}
                component={LoginRoute}
                options={{
                    cardStyle: [{backgroundColor: theme.backgroundColor}],
                }}
            />
        );
    };

    const RenderAppStack = () => {
        return (
            <>
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
                        cardStyle,
                    }}
                />
                <RootStack.Screen
                    name={ROOT_SCREEN.listFollows}
                    component={ListFollows}
                    options={{
                        cardStyle,
                    }}
                />

                <RootStack.Screen
                    name={ROOT_SCREEN.detailBubble}
                    component={DetailBubble}
                    options={{
                        cardStyle,
                    }}
                />
                <RootStack.Screen
                    name={ROOT_SCREEN.listDetailPost}
                    component={ListDetailPost}
                    options={{
                        // cardStyleInterpolator:
                        //     CardStyleInterpolators.forScaleFromCenterAndroid,
                        cardStyle,
                    }}
                />

                {/* Interact Bubble */}
                <RootStack.Screen
                    options={{
                        cardStyle: [{backgroundColor: selectBgCardStyle(0.3)}],
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                    }}
                    name={ROOT_SCREEN.interactBubble}
                    component={InteractBubble}
                />

                {/* Swipe Image */}
                <RootStack.Screen
                    options={{
                        cardStyle,
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                    }}
                    name={ROOT_SCREEN.swipeImages}
                    component={SwipeImages}
                />

                <RootStack.Screen
                    name={ROOT_SCREEN.reportUser}
                    component={ReportUser}
                    options={{
                        cardStyle,
                    }}
                />

                <RootStack.Screen
                    name={PROFILE_ROUTE.settingRoute}
                    component={SettingRoute}
                />

                <RootStack.Screen
                    name={PROFILE_ROUTE.createPostPreview}
                    component={CreatePostPreview}
                />
                <RootStack.Screen
                    name={PROFILE_ROUTE.createGroup}
                    component={CreateGroup}
                />
                <RootStack.Screen
                    name={MESS_ROUTE.chatDetail}
                    component={ChatDetail}
                    options={{
                        gestureEnabled: isIOS,
                    }}
                />
                <RootStack.Screen
                    name={MESS_ROUTE.chatDetailGroup}
                    component={ChatDetailGroup}
                    options={{
                        gestureEnabled: isIOS,
                    }}
                />
                <RootStack.Screen
                    name={MESS_ROUTE.chatDetailSetting}
                    component={ChatDetailSetting}
                />

                <RootStack.Screen
                    name={MESS_ROUTE.publicChatting}
                    component={PublicChatting}
                    options={{
                        cardStyleInterpolator:
                            CardStyleInterpolators.forFadeFromBottomAndroid,
                        animationEnabled: false,
                    }}
                />
            </>
        );
    };

    if (initLoading) {
        return null;
    }

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
                    edges={['bottom', 'left', 'right', 'top']}>
                    <RootStack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {isModeExp || token
                            ? RenderAppStack()
                            : RenderAuthenticationStack()}

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
                                cardStyle,
                            }}
                            name={ROOT_SCREEN.modalize}
                            component={Modalize}
                        />

                        {/* Web view */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.webView}
                            component={WebViewScreen}
                            options={{
                                cardStyle,
                            }}
                        />

                        {/* Picker */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.picker}
                            component={StylePicker}
                            options={{
                                cardStyle: [
                                    {backgroundColor: selectBgCardStyle(0.6)},
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

export default RootScreen;
