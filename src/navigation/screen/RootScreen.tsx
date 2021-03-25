/*eslint-disable react-native/no-inline-styles */
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Theme from 'asset/theme/Theme';
import Alert from 'components/Alert';
import useRedux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigationRef} from 'navigation/NavigationService';
import React, {FunctionComponent, useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {selectBgCardStyle} from 'utility/assistant';
import {selectIsLogged} from 'utility/login/selectScreen';
import LoginRoute from './LoginRoute';
import MainTabs from './MainTabs';

const RootStack = createStackNavigator();

const RootScreen: FunctionComponent = () => {
    const Redux = useRedux();
    const theme = Redux.getTheme();
    const barStyle =
        theme === Theme.darkTheme ? 'light-content' : 'dark-content';

    const select = async () => {
        await selectIsLogged();
    };

    useEffect(() => {
        select();
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle={barStyle} />
            <SafeAreaView
                style={{
                    flex: 1,
                    overflow: 'visible',
                    backgroundColor: theme.backgroundColor,
                }}>
                <RootStack.Navigator screenOptions={{gestureEnabled: false}}>
                    <RootStack.Screen
                        options={{headerShown: false}}
                        name={ROOT_SCREEN.loginRoute}
                        component={LoginRoute}
                    />

                    <RootStack.Screen
                        options={{headerShown: false}}
                        name={ROOT_SCREEN.mainScreen}
                        component={MainTabs}
                    />

                    <RootStack.Screen
                        options={{
                            ...alertOption,
                            cardStyle: {
                                backgroundColor: selectBgCardStyle(theme, 0.6),
                            },
                        }}
                        name={ROOT_SCREEN.alert}
                        component={Alert}
                    />
                </RootStack.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
};

const alertOption = {
    animationEnabled: false,
    cardOverlayEnabled: true,
    headerShown: false,
};

export default RootScreen;
