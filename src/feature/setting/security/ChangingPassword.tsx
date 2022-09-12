import {yupResolver} from '@hookform/resolvers/yup';
import {apiChangePassword} from 'api/module';
import {StyleButton, StyleInputForm} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect, useRef, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Animated} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';

interface Props {
    isOpening: boolean;
}

const ChangingPassword = ({isOpening}: Props) => {
    const {t} = useTranslation();
    const isModeExp = Redux.getModeExp();
    const theme = Redux.getTheme();

    const aim = useRef(new Animated.Value(0)).current;
    const [height, setHeight] = useState(0);
    aim.addListener(({value}) => setHeight(value));

    const ref_newPassword = useRef<any>(null);
    const ref_passwordCf = useRef<any>(null);

    const [password, setPassword] = useState<any>();

    const getPassword = async () => {
        const temp = (await FindmeAsyncStorage.getActiveUser()).password;
        setPassword(temp);
    };

    useEffect(() => {
        getPassword();
    }, []);

    useEffect(() => {
        Animated.timing(aim, {
            toValue: isOpening ? verticalScale(200) : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpening]);

    const passwordSchema = yup.object().shape({
        // nowPass: yup.string().test('no', t('alert.nowPassError'), value => {
        //     return value === password;
        // }),
        nowPass: yupValidate.default(),
        newPass: yupValidate.password(),
        confirmPass: yupValidate.password('newPass'),
    });
    const form = useForm({
        mode: 'all',
        resolver: yupResolver(passwordSchema),
    });
    const {
        setValue,
        getValues,
        formState: {errors},
    } = form;

    const confirmChangePassword = async () => {
        if (errors.nowPass || errors.newPass || errors.confirmPass) {
            if (errors.nowPass) {
                appAlert(errors.nowPass.message);
            } else if (errors.newPass) {
                appAlert(errors.newPass.message);
            } else if (errors.confirmPass) {
                appAlert(errors.confirmPass.message);
            }
            return;
        }
        try {
            Redux.setIsLoading(true);

            const oldPassword = getValues('nowPass');
            const newPassword = getValues('newPass');
            const confirmPassword = getValues('confirmPass');

            if (oldPassword !== password) {
                appAlert('alert.nowPassError');
                return;
            }

            if (!isModeExp) {
                await apiChangePassword({
                    oldPassword,
                    newPassword,
                    confirmPassword,
                });
                await FindmeAsyncStorage.updateActiveUser({
                    password: newPassword,
                });
                await FindmeAsyncStorage.editIndexNowAccount({
                    password: newPassword,
                });

                setPassword(getValues('newPass'));
                setValue('nowPass', '');
                setValue('newPass', '');
                setValue('confirmPass', '');
            }

            appAlert('alert.successChange');
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <Animated.View style={[styles.container, {height}]}>
            <FormProvider {...form}>
                <StyleInputForm
                    name="nowPass"
                    placeholder={t('setting.securityAndLogin.nowPass')}
                    placeholderTextColor={theme.holderColor}
                    containerStyle={[
                        styles.moduleInput,
                        {borderColor: theme.borderColor},
                    ]}
                    inputStyle={styles.inputStyle}
                    hasErrorBox={false}
                    onSubmitEditing={() => ref_newPassword.current.focus()}
                    secureTextEntry
                />

                <StyleInputForm
                    ref={ref_newPassword}
                    name="newPass"
                    placeholder={t('setting.securityAndLogin.newPass')}
                    placeholderTextColor={theme.holderColor}
                    containerStyle={[
                        styles.moduleInput,
                        {borderColor: theme.borderColor},
                    ]}
                    inputStyle={styles.inputStyle}
                    hasErrorBox={false}
                    onSubmitEditing={() => ref_passwordCf.current.focus()}
                    secureTextEntry
                />

                <StyleInputForm
                    ref={ref_passwordCf}
                    name="confirmPass"
                    placeholder={t('setting.securityAndLogin.confirmPass')}
                    placeholderTextColor={theme.holderColor}
                    containerStyle={[
                        styles.moduleInput,
                        {borderColor: theme.borderColor},
                    ]}
                    inputStyle={styles.inputStyle}
                    hasErrorBox={false}
                    returnKeyType="done"
                    secureTextEntry
                />
            </FormProvider>

            <StyleButton
                containerStyle={styles.buttonConfirm}
                titleStyle={styles.textButtonCf}
                title="setting.securityAndLogin.buttonChangePass"
                onPress={confirmChangePassword}
            />
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '90%',
        paddingHorizontal: '20@s',
        alignItems: 'center',
        overflow: 'hidden',
    },
    moduleInput: {
        width: '100%',
        borderWidth: 0.5,
        borderRadius: '20@s',
        marginVertical: '5@vs',
        paddingVertical: isIOS ? '10@vs' : 0,
    },
    buttonConfirm: {
        marginVertical: '15@vs',
        paddingHorizontal: '30@s',
        paddingVertical: '7@vs',
    },
    textButtonCf: {
        fontSize: '14@ms',
    },
    inputStyle: {
        fontSize: '14@ms',
        paddingHorizontal: '17@s',
    },
});

export default memo(ChangingPassword);
