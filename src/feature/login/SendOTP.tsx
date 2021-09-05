import {useIsFocused} from '@react-navigation/native';
import {TypeRegisterReq, TypeRequestOTPRequest} from 'api/interface';
import {apiCheckOTP, apiRequestOTP} from 'api/module';
import {standValue} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleText,
    StyleTouchable,
} from 'components/base';
import useCountdown from 'hook/useCountdown';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from './components/HeaderLogo';

/**
 * SWITCH TO ONE OF THREE ABOVE COMPONENT
 */
interface ParamsType {
    name: string;
    // for reset password
    isResetPassword?: boolean;
    username?: string;
    // for register
    itemSignUp?: TypeRegisterReq; // transmitted from "SignUpForm"
    paramsOTP: TypeRequestOTPRequest;
}

const SendOTP = ({route}: any) => {
    const params: ParamsType = route?.params;
    const {name, isResetPassword, username, itemSignUp, paramsOTP} = params;

    const theme = Redux.getTheme();
    const {t} = useTranslation();
    const isFocused = useIsFocused();

    const {countdown, resetCountdown, clearCountdown} = useCountdown(
        standValue.COUNT_DOWN,
    );
    const [code, setCode] = useState('');

    useEffect(() => {
        if (!isFocused) {
            clearCountdown();
        }
    }, [isFocused]);

    const onPressConfirm = async () => {
        // reset password
        if (isResetPassword && username) {
            try {
                await apiCheckOTP({
                    username,
                    code,
                });
                navigate(LOGIN_ROUTE.forgetPasswordForm, {
                    username,
                });
            } catch (err) {
                appAlert(err);
            }
            return;
        }
        // register
        if (itemSignUp) {
            try {
                await apiCheckOTP({
                    username: itemSignUp.username,
                    code,
                });
                navigate(LOGIN_ROUTE.agreeTermOfService, {
                    itemSignUp,
                });
            } catch (err) {
                appAlert(err);
            }
        }
    };

    const onSendAgain = async () => {
        if (itemSignUp) {
            try {
                await apiRequestOTP(paramsOTP);
                resetCountdown();
            } catch (err) {
                appAlert(err);
            }
        }
    };

    return (
        <StyleContainer customStyle={styles.container}>
            {/* BANNER IMAGE */}
            <HeaderLogo />

            {/* NOTIFICATION TO USER */}
            <StyleText
                i18Text="login.component.sendOTP.notiOTP"
                customStyle={[
                    styles.textNotification,
                    {
                        color: theme.textColor,
                    },
                ]}
            />
            <StyleText
                originValue={name}
                customStyle={[styles.textDestination, {color: theme.textColor}]}
            />

            {/* ENTER CODE */}
            <TextInput
                value={code}
                onChangeText={text => setCode(text)}
                style={[
                    styles.enterCodeInput,
                    {
                        borderBottomColor: theme.borderColor,
                        color: theme.textColor,
                    },
                ]}
                maxLength={4}
                keyboardType="numeric"
                placeholderTextColor={theme.holderColor}
                placeholder={t('login.component.sendOTP.enterCode')}
            />

            {/* CONFIRM BUTTON */}
            <StyleButton
                title="login.component.sendOTP.confirmButton"
                onPress={onPressConfirm}
                containerStyle={styles.confirmButton}
            />

            {/* SEND CODE AGAIN */}
            <StyleTouchable
                customStyle={styles.buttonSendAgain}
                disable={countdown > 0}
                onPress={onSendAgain}>
                <StyleText
                    i18Text="login.component.sendOTP.sendAgain"
                    i18Params={{countdown: countdown}}
                    customStyle={[
                        styles.titleSendAgain,
                        {color: theme.textColor},
                    ]}
                />
            </StyleTouchable>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    textNotification: {
        fontSize: 20,
        marginTop: '5%',
        marginBottom: '2%',
    },
    textDestination: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    enterCodeInput: {
        borderBottomWidth: 1,
        borderRadius: '10@vs',
        width: '150@vs',
        fontSize: 25,
        paddingHorizontal: '20@vs',
        paddingVertical: '10@vs',
        marginVertical: '20@vs',
        textAlign: 'center',
    },
    buttonSendAgain: {
        marginTop: '15%',
    },
    confirmButton: {
        marginTop: '10%',
        paddingHorizontal: '50@vs',
    },
    titleSendAgain: {
        fontSize: 17,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
});

export default SendOTP;
