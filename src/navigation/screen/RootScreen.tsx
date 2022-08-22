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

const cardSafe = {
    paddingTop: Metrics.safeTopPadding,
};

const NullNode = () => {
    return <></>;
};

const RootScreen = () => {
    const isLoading = Redux.getIsLoading();
    const theme = Redux.getTheme();

    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    const [initLoading, setInitLoading] = useState(true);

    const isInApp = isModeExp || token;
    const barStyle = !isInApp
        ? 'light-content'
        : theme === Theme.darkTheme
        ? 'light-content'
        : 'dark-content';

    const cardStyle = {
        backgroundColor: theme.backgroundColor,
        ...cardSafe,
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

    return (
        <NavigationContainer ref={navigationRef}>
            <TabBarProvider>
                <StatusBar barStyle={barStyle} />

                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <RootStack.Screen
                        name="check"
                        component={
                            initLoading
                                ? NullNode
                                : isInApp
                                ? AppStack
                                : LoginRoute
                        }
                    />

                    {/* Alert */}
                    <RootStack.Screen
                        options={{
                            ...alertOption,
                            cardStyle: {
                                backgroundColor: theme.backgroundOpacity(0.6),
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
                                backgroundColor: theme.backgroundOpacity(0.6),
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
                                {backgroundColor: theme.backgroundOpacity(0.6)},
                                cardSafe,
                            ],
                            cardStyleInterpolator:
                                CardStyleInterpolators.forFadeFromBottomAndroid,
                        }}
                    />
                </RootStack.Navigator>

                {/* For loading all app */}
                {isLoading && <LoadingScreen />}

                <DynamicLink />
            </TabBarProvider>
        </NavigationContainer>
    );
};

export default RootScreen;
