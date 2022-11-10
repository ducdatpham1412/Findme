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
import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import TabBarProvider from 'navigation/config/TabBarProvider';
import {navigationRef} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import SplashScreen from 'react-native-splash-screen';
import {isIOS, logger} from 'utility/assistant';
import {LanguageProvider} from 'utility/format';
import {selectIsHaveActiveUser} from 'utility/login/selectScreen';
import AppStack from './AppStack';
import DynamicLink from './DynamicLink';
import LoginRoute from './LoginRoute';
import WebViewScreen from './WebViewScreen';

const RootStack = createStackNavigator();

const alertOption: StackNavigationOptions = {
    animationEnabled: false,
    cardOverlayEnabled: true,
    headerShown: false,
};

const RootScreen = () => {
    const theme = Redux.getTheme();

    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    // isLogOut to check if token blackListed, set initLoading = false to return LoginRoute, if not it will be stuck in LoadingScreen
    const isLogOut = Redux.getIstLogOut();

    const [initLoading, setInitLoading] = useState(true);

    const isInApp = isModeExp || token;
    const barStyle = !isInApp
        ? 'light-content'
        : theme === Theme.darkTheme
        ? 'light-content'
        : 'dark-content';

    const initApp = async () => {
        try {
            await selectIsHaveActiveUser();
            setInitLoading(false);
        } catch (err) {
            logger(err);
        } finally {
            SplashScreen.hide();
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

    useEffect(() => {
        if (isLogOut) {
            setInitLoading(false);
            Redux.setIsLogOut(false);
        }
    }, [isLogOut]);

    const choosingRoute = () => {
        if (initLoading) {
            return LoadingScreen;
        }
        if (isInApp) {
            return AppStack;
        }
        return LoginRoute;
    };

    return (
        <NavigationContainer ref={navigationRef}>
            <LanguageProvider>
                <TabBarProvider>
                    <StatusBar barStyle={barStyle} />

                    <RootStack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <RootStack.Screen
                            name="check"
                            component={choosingRoute()}
                        />

                        {/* Alert */}
                        <RootStack.Screen
                            options={{
                                ...alertOption,
                                cardStyle: {
                                    backgroundColor: theme.backgroundOpacity(),
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
                                    backgroundColor: theme.backgroundOpacity(),
                                },
                            }}
                            name={ROOT_SCREEN.alertYesNo}
                            component={AlertYesNo}
                        />

                        {/* Web view */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.webView}
                            component={WebViewScreen}
                            options={{
                                cardStyle: [
                                    {
                                        backgroundColor: theme.backgroundColor,
                                    },
                                ],
                            }}
                        />

                        {/* Picker */}
                        <RootStack.Screen
                            name={ROOT_SCREEN.picker}
                            component={StylePicker}
                            options={{
                                cardStyle: [
                                    {
                                        backgroundColor:
                                            theme.backgroundOpacity(),
                                    },
                                ],
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forFadeFromBottomAndroid,
                            }}
                        />
                    </RootStack.Navigator>

                    <DynamicLink />
                </TabBarProvider>
            </LanguageProvider>
        </NavigationContainer>
    );
};

export default RootScreen;
