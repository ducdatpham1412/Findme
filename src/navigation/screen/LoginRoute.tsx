import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import ChoosingLoginOrEnjoy from 'feature/login/ChoosingLoginOrEnjoy';
import DetailInformation from 'feature/login/DetailInformation';
import ForgetPasswordForm from 'feature/login/forgetPassword/ForgetPasswordForm';
import ForgetPasswordInput from 'feature/login/forgetPassword/ForgetPasswordInput';
import ForgetPasswordType from 'feature/login/forgetPassword/ForgetPasswordType';
import LoginScreen from 'feature/login/LoginScreen';
import SendOTP from 'feature/login/SendOTP';
import SignUpForm from 'feature/login/signUp/SignUpForm';
import SignUpType from 'feature/login/signUp/SignUpType';
import Stater from 'feature/login/Starter';
import useRedux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

const Stack = createStackNavigator();

const LoginRoute: React.FunctionComponent = () => {
    const theme = useRedux().getTheme();
    const {t} = useTranslation();

    const headerTitleStyle: StyleProp<TextStyle> = {
        fontSize: 20,
        fontWeight: 'bold',
    };
    const headerStyle: StyleProp<ViewStyle> = {
        backgroundColor: theme.backgroundColor,
    };

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerLeft: (props: any) => <HeaderLeftIcon {...props} />,
            }}>
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
                    headerTitle: t('login.detailInformation.header'),
                    headerTitleStyle,
                    headerStyle,
                }}
                name={LOGIN_ROUTE.detailInformation}
                component={DetailInformation}
            />

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
                name={LOGIN_ROUTE.forgetPasswordInput}
                component={ForgetPasswordInput}
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
