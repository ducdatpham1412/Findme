import {NavigationContainer} from '@react-navigation/native';
import {
    createStackNavigator,
    CardStyleInterpolators,
} from '@react-navigation/stack';
import Theme from 'asset/theme/Theme';
import Alert from 'components/Alert';
import AlertYesNo from 'components/AlerYesNo';
import Modalize from 'components/common/useModalize';
import InteractBubble from 'feature/discovery/InteractBubble';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import TabBarProvider from 'navigation/config/TabBarProvider';
import {navigationRef} from 'navigation/NavigationService';
import React, {FunctionComponent, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {selectBgCardStyle} from 'utility/assistant';
import {selectIsHaveActiveUser} from 'utility/login/selectScreen';
import LoginRoute from './LoginRoute';
import MainTabs from './MainTabs';

const RootStack = createStackNavigator();

const RootScreen: FunctionComponent = () => {
    const theme = Redux.getTheme();
    const barStyle =
        theme === Theme.darkTheme ? 'light-content' : 'dark-content';

    const selectScreen = async () => {
        await selectIsHaveActiveUser();
        SplashScreen.hide();
    };

    useEffect(() => {
        selectScreen();
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
                    edges={['top']}>
                    <RootStack.Navigator
                        screenOptions={{gestureEnabled: false}}>
                        {/* Authentication */}
                        <RootStack.Screen
                            options={{headerShown: false}}
                            name={ROOT_SCREEN.loginRoute}
                            component={LoginRoute}
                        />

                        {/* Main Tabs */}
                        <RootStack.Screen
                            options={{headerShown: false}}
                            name={ROOT_SCREEN.mainScreen}
                            component={MainTabs}
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
                                cardStyle: {
                                    backgroundColor: selectBgCardStyle(0.6),
                                },
                            }}
                            name={ROOT_SCREEN.modalize}
                            component={Modalize}
                        />

                        {/* INTERACT BUBBLE */}
                        <RootStack.Screen
                            options={{
                                headerShown: false,
                                cardStyle: {
                                    backgroundColor: selectBgCardStyle(0.6),
                                },
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forFadeFromBottomAndroid,
                            }}
                            name={ROOT_SCREEN.interactBubble}
                            component={InteractBubble}
                        />
                    </RootStack.Navigator>
                </SafeAreaView>
            </TabBarProvider>
        </NavigationContainer>
    );
};

const alertOption = {
    animationEnabled: false,
    cardOverlayEnabled: true,
    headerShown: false,
};

export default RootScreen;
