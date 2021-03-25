import {standValue} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleText,
    StyleTouchable,
} from 'components/base';
import useCountdown from 'hook/useCountdown';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from './components/HeaderLogo';

const EnterCode = () => {
    const theme = useRedux().getTheme();
    const {t} = useTranslation();
    return (
        <TextInput
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
    );
};

const ConfirmButton = ({isForgetPassOTP}: any) => {
    const confirm = () => {
        if (isForgetPassOTP) {
            navigate(LOGIN_ROUTE.forgetPasswordForm);
            return;
        }
        navigate(LOGIN_ROUTE.detailInformation);
    };

    return (
        <StyleButton
            title="login.component.sendOTP.confirmButton"
            onPress={confirm}
            containerStyle={styles.confirmButton}
        />
    );
};

const SendAgain = () => {
    const theme = useRedux().getTheme();
    const {countdown, setCountdown} = useCountdown(standValue.COUNT_DOWN);

    const onSendAgain = async () => {
        // await request Code
        setCountdown(standValue.COUNT_DOWN);
    };

    return (
        <StyleTouchable
            customStyle={styles.buttonSendAgain}
            disable={countdown > 0}
            onPress={onSendAgain}>
            <StyleText
                i18Text="login.component.sendOTP.sendAgain"
                i18Params={{countdown: countdown}}
                customStyle={[styles.titleSendAgain, {color: theme.textColor}]}
            />
        </StyleTouchable>
    );
};

/**
 * SWITCH TO ONE OF THREE ABOVE COMPONENT
 */
interface ParamsType {
    name: string;
    isForgetPassOTP?: boolean;
}

const SendOTP = ({route}: any) => {
    const params: ParamsType = route?.params;
    const {name, isForgetPassOTP} = params;
    const theme = useRedux().getTheme();

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
            <EnterCode />

            {/* CONFIRM BUTTON */}
            <ConfirmButton isForgetPassOTP={isForgetPassOTP} />

            {/* SEND CODE AGAIN */}
            <SendAgain />
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
