import {useIsFocused} from '@react-navigation/native';
import {TypeRegisterReq, TypeRequestOTPRequest} from 'api/interface';
import {
    apiCheckOTP,
    apiOpenAccount,
    apiRegister,
    apiRequestOTP,
} from 'api/module';
import {TYPE_OTP} from 'asset/enum';
import {standValue} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import useCountdown from 'hook/useCountdown';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from './components/HeaderLogo';

interface ParamsType {
    name: string;
    // for reset password
    isResetPassword?: boolean;
    username?: string;
    // for register
    itemSignUp?: TypeRegisterReq; // transmitted from "SignUpForm"
    paramsOTP: TypeRequestOTPRequest;
    // for open account
    isOpenAccount?: boolean;
    // username?: string
}

const SendOTP = ({route}: any) => {
    const params: ParamsType = route?.params;
    const {
        name,
        isResetPassword,
        username,
        itemSignUp,
        paramsOTP,
        isOpenAccount,
    } = params;

    const theme = Redux.getTheme();
    const isFocused = useIsFocused();

    const {countdown, resetCountdown, clearCountdown} = useCountdown(
        standValue.COUNT_DOWN,
    );
    const codeRef = useRef<TextInput>(null);
    const [code, setCode] = useState('');

    useEffect(() => {
        if (!isFocused) {
            clearCountdown();
        }
    }, [isFocused]);

    useEffect(() => {
        codeRef.current?.focus();
    }, []);

    const onPressConfirm = async () => {
        /**
         * Reset password
         */
        if (isResetPassword && username) {
            try {
                Redux.setIsLoading(true);
                await apiCheckOTP({
                    username,
                    code,
                });
                navigate(LOGIN_ROUTE.forgetPasswordForm, {
                    username,
                });
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
            return;
        }

        /**
         * Register
         */
        if (itemSignUp) {
            try {
                Redux.setIsLoading(true);
                await apiCheckOTP({
                    username: paramsOTP.username,
                    code,
                });
                await apiRegister(itemSignUp);
                navigate(LOGIN_ROUTE.agreeTermOfService, {
                    itemSignUp,
                });
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }

        /**
         * Open account
         */
        if (isOpenAccount && username) {
            try {
                Redux.setIsLoading(true);
                await apiOpenAccount({
                    username,
                    verifyCode: code,
                });
                appAlert('login.loginScreen.openAccountSuccess', {
                    actionClickOk: () => navigate(LOGIN_ROUTE.loginScreen),
                });
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    const onSendAgain = useCallback(async () => {
        try {
            if (itemSignUp) {
                resetCountdown();
                await apiRequestOTP(paramsOTP);
            } else if (isResetPassword && username) {
                await apiRequestOTP({
                    username: username,
                    typeOTP: TYPE_OTP.resetPassword,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    }, [itemSignUp, isResetPassword, username]);

    /**
     * Render view
     */
    const TextSendAgain = useMemo(() => {
        return countdown > 0
            ? 'login.component.sendOTP.sendAgain'
            : 'login.component.sendOTP.sendAgainNoCount';
    }, [countdown > 0]);

    const RenderTextNotification = useMemo(() => {
        return (
            <>
                <StyleText
                    i18Text="login.component.sendOTP.notiOTP"
                    customStyle={[
                        styles.textNotification,
                        {
                            color: theme.borderColor,
                        },
                    ]}
                />
                <StyleText
                    originValue={name}
                    customStyle={[
                        styles.textDestination,
                        {color: theme.textColor},
                    ]}
                />
            </>
        );
    }, [name]);

    return (
        <StyleContainer customStyle={styles.container}>
            <HeaderLogo />

            {/* Notification */}
            {RenderTextNotification}

            {/* Enter code */}
            <StyleInput
                ref={codeRef}
                value={code}
                onChangeText={text => setCode(text)}
                inputStyle={styles.enterCodeInput}
                containerStyle={styles.enterCodeInputView}
                maxLength={4}
                keyboardType="numeric"
                placeholderTextColor={theme.holderColor}
                i18Placeholder="login.component.sendOTP.enterCode"
            />

            {/* Button confirm */}
            <StyleButton
                title="login.component.sendOTP.confirmButton"
                onPress={onPressConfirm}
                containerStyle={styles.confirmButton}
            />

            {/* Send again */}
            <StyleTouchable
                customStyle={styles.buttonSendAgain}
                disable={countdown > 0}
                onPress={onSendAgain}>
                <StyleText
                    i18Text={TextSendAgain}
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
        fontSize: '17@ms',
        marginTop: '5%',
        marginBottom: '2%',
    },
    textDestination: {
        fontSize: '13@ms',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    enterCodeInputView: {
        width: '150@vs',
        marginTop: '30@vs',
    },
    enterCodeInput: {
        paddingHorizontal: '20@vs',
        textAlign: 'center',
        fontSize: '20@ms',
    },
    buttonSendAgain: {
        marginTop: '25%',
    },
    confirmButton: {
        marginTop: '10%',
        paddingHorizontal: '50@vs',
    },
    titleSendAgain: {
        fontSize: '15@ms',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
});

export default SendOTP;
