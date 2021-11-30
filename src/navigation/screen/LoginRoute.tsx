import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import ChoosingLoginOrEnjoy from 'feature/login/ChoosingLoginOrEnjoy';
import ConfirmOpenAccount from 'feature/login/ConfirmOpenAccount';
import ForgetPasswordForm from 'feature/login/forgetPassword/ForgetPasswordForm';
import ForgetPasswordSend from 'feature/login/forgetPassword/ForgetPasswordSend';
import ForgetPasswordType from 'feature/login/forgetPassword/ForgetPasswordType';
import LoginScreen from 'feature/login/LoginScreen';
import SendOTP from 'feature/login/SendOTP';
import AgreeTermOfService from 'feature/login/signUp/AgreeTermOfService';
import SignUpForm from 'feature/login/signUp/SignUpForm';
import SignUpType from 'feature/login/signUp/SignUpType';
import Stater from 'feature/login/Starter';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Stack = createStackNavigator();

const LoginRoute: React.FunctionComponent = () => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();

    const headerTitleStyle: StyleProp<TextStyle> = {
        fontSize: moderateScale(17),
        fontWeight: 'bold',
    };
    const headerStyle: StyleProp<ViewStyle> = {
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 0,
    };

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerLeft: (props: any) => <HeaderLeftIcon {...props} />,
            }}
            // initialRouteName={LOGIN_ROUTE.detailInformation}
        >
            {/* STARTER */}
            <Stack.Screen
                options={{headerShown: false}}
                name={LOGIN_ROUTE.starter}
                component={Stater}
            />

            <Stack.Screen
                options={{headerShown: false, gestureEnabled: false}}
                name={LOGIN_ROUTE.loginScreen}
                component={LoginScreen}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
                name={LOGIN_ROUTE.choosingLoginOrEnjoy}
                component={ChoosingLoginOrEnjoy}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name={LOGIN_ROUTE.confirmOpenAccount}
                component={ConfirmOpenAccount}
            />

            {/* SIGN UP */}
            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.signUp.type.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.signUpType}
                component={SignUpType}
            />

            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.signUp.form.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.signUpForm}
                component={SignUpForm}
            />

            {/* Send OTP */}
            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.component.sendOTP.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.sendOTP}
                component={SendOTP}
            />

            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.agreeTermOfService.registerSuccess'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.agreeTermOfService}
                component={AgreeTermOfService}
            />

            {/* DetailInformation */}
            {/* <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.detailInformation.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.detailInformation}
                component={DetailInformation}
            /> */}

            {/* FORGET */}
            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.forgetPassword.type.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.forgetPasswordType}
                component={ForgetPasswordType}
            />

            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.forgetPassword.type.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.forgetPasswordSend}
                component={ForgetPasswordSend}
            />

            <Stack.Screen
                options={{
                    headerTintColor: theme.textColor,
                    headerTitle: t('login.forgetPassword.form.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.forgetPasswordForm}
                component={ForgetPasswordForm}
            />
        </Stack.Navigator>
    );
};

export default LoginRoute;
