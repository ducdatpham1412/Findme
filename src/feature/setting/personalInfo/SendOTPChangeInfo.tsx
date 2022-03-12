import {useIsFocused} from '@react-navigation/native';
import ChangePersonalInfo from 'api/actions/setting/ChangePersonalInfo';
import {TypeRequestOTPRequest} from 'api/interface';
import {apiCheckOTP, apiRequestOTP} from 'api/module';
import {standValue} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import HeaderLogo from 'feature/login/components/HeaderLogo';
import useCountdown from 'hook/useCountdown';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    route: {
        params: {
            name: string;
            newInfo: any;
            typeChange: string;
            paramsOTP: TypeRequestOTPRequest;
        };
    };
}

const SendOTPChangeInfo = ({route}: Props) => {
    const {name, newInfo, typeChange, paramsOTP} = route.params;

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
        try {
            Redux.setIsLoading(true);
            await apiCheckOTP({username: paramsOTP.username, code});
            await ChangePersonalInfo.changeInfo(newInfo, typeChange);
            navigate(SETTING_ROUTE.personalInformation);
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    const onSendAgain = async () => {
        try {
            resetCountdown();
            await apiRequestOTP(paramsOTP);
        } catch (err) {
            appAlert(err);
        }
    };

    const TextSendAgain = useMemo(() => {
        return countdown > 0
            ? 'login.component.sendOTP.sendAgain'
            : 'login.component.sendOTP.sendAgainNoCount';
    }, [countdown > 0]);

    return (
        <>
            <StyleHeader title="login.component.sendOTP.header" />

            <StyleContainer customStyle={styles.container}>
                <HeaderLogo />

                {/* Notification */}
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
                    customStyle={[
                        styles.textDestination,
                        {color: theme.textColor},
                    ]}
                />

                {/* Enter code */}
                <StyleInput
                    value={code}
                    onChangeText={text => setCode(text)}
                    inputStyle={styles.enterCodeInput}
                    containerStyle={styles.enterCodeInputView}
                    maxLength={4}
                    keyboardType="numeric"
                    placeholderTextColor={theme.holderColor}
                    placeholder={t('login.component.sendOTP.enterCode')}
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
        </>
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

export default SendOTPChangeInfo;
