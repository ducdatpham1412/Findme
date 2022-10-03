import {TypeRequestOTPRequest} from 'api/interface';
import {apiRequestOTP} from 'api/module';
import {SIGN_UP_TYPE, TYPE_OTP} from 'asset/enum';
import {StyleButton, StyleContainer, StyleInput} from 'components/base';
import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';

interface Props {
    route: {
        params: {
            newInfo: {
                email?: string;
                phone?: string;
            };
        };
    };
}

const EnterPassword = ({route}: Props) => {
    const {newInfo} = route.params;
    const isLoading = Redux.getIsLoading();
    const inputRef = useRef<TextInput>(null);
    const [password, setPassword] = useState('');

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const onConfirmPassword = async () => {
        const activeUser = await FindmeAsyncStorage.getActiveUser();

        if (activeUser.password !== password) {
            appAlert('setting.personalInfo.passwordNotTrue');
            return;
        }

        let targetInfo: number | undefined;
        let username = '';
        if (newInfo.email) {
            targetInfo = SIGN_UP_TYPE.email;
            username = newInfo.email;
        } else if (newInfo.phone) {
            targetInfo = SIGN_UP_TYPE.phone;
            username = newInfo.phone;
        }

        if (targetInfo !== undefined) {
            const paramsOTP: TypeRequestOTPRequest = {
                username,
                targetInfo,
                typeOTP: TYPE_OTP.changeInfo,
            };

            try {
                Redux.setIsLoading(true);
                await apiRequestOTP(paramsOTP);
                navigate(SETTING_ROUTE.sendOTPChangeInfo, {
                    name: username,
                    newInfo,
                    paramsOTP,
                });
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    return (
        <>
            <StyleHeader title="setting.personalInfo.enterPassword" />

            <StyleContainer>
                <StyleInput
                    ref={inputRef}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    i18Placeholder="setting.personalInfo.password"
                    containerStyle={styles.inputView}
                    secureTextEntry
                    onSubmitEditing={onConfirmPassword}
                />

                <StyleButton
                    title="setting.personalInfo.confirm"
                    containerStyle={styles.buttonView}
                    onPress={onConfirmPassword}
                />

                {isLoading && <LoadingScreen />}
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    inputView: {
        marginTop: '150@vs',
    },
    buttonView: {
        paddingVertical: '10@vs',
        marginTop: '50@vs',
    },
});

export default EnterPassword;
