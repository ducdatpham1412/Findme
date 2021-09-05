import {yupResolver} from '@hookform/resolvers/yup';
import {apiChangePassword} from 'api/module';
import {StyleInputForm, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';

const ChangingPassword = () => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();

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

    const passwordSchema = yup.object().shape({
        nowPass: yup.string().test('no', t('alert.nowPassError'), value => {
            return value === password;
        }),
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
            await apiChangePassword({
                oldPassword: getValues('nowPass'),
                newPassword: getValues('newPass'),
                confirmPassword: getValues('confirmPass'),
            });
            await FindmeAsyncStorage.updateActiveUser({
                password: getValues('newPass'),
            });
            await FindmeAsyncStorage.editIndexNowAccount({
                password: getValues('newPass'),
            });
            await getPassword();

            setValue('nowPass', '');
            setValue('newPass', '');
            setValue('confirmPass', '');
            appAlert('alert.successChange');
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <View style={styles.container}>
            <FormProvider {...form}>
                {/* NOW PASSWORD */}
                <View
                    style={[
                        styles.moduleInput,
                        {borderColor: theme.borderColor},
                    ]}>
                    <StyleInputForm
                        name="nowPass"
                        placeholder={t('setting.securityAndLogin.nowPass')}
                        placeholderTextColor={theme.holderColor}
                        containerStyle={{width: '90%'}}
                        inputStyle={styles.styleInput}
                        hasErrorBox={false}
                        onSubmitEditing={() => ref_newPassword.current.focus()}
                        secureTextEntry
                    />
                </View>

                {/* NEW PASSWORD */}
                <View
                    style={[
                        styles.moduleInput,
                        {borderColor: theme.borderColor},
                    ]}>
                    <StyleInputForm
                        ref={ref_newPassword}
                        name="newPass"
                        placeholder={t('setting.securityAndLogin.newPass')}
                        placeholderTextColor={theme.holderColor}
                        containerStyle={{width: '90%'}}
                        inputStyle={styles.styleInput}
                        hasErrorBox={false}
                        onSubmitEditing={() => ref_passwordCf.current.focus()}
                        secureTextEntry
                    />
                </View>

                {/* PASSWORD CONFIRM */}
                <View
                    style={[
                        styles.moduleInput,
                        {borderColor: theme.borderColor},
                    ]}>
                    <StyleInputForm
                        ref={ref_passwordCf}
                        name="confirmPass"
                        placeholder={t('setting.securityAndLogin.confirmPass')}
                        placeholderTextColor={theme.holderColor}
                        containerStyle={{width: '90%'}}
                        inputStyle={styles.styleInput}
                        hasErrorBox={false}
                        returnKeyType="done"
                        secureTextEntry
                    />
                </View>
            </FormProvider>

            {/* BUTTON TO CHECK IS RIGHT AND CHANGE OR ALERT */}
            <StyleTouchable
                customStyle={[
                    styles.buttonConfirm,
                    {borderColor: theme.borderColor},
                ]}
                onPress={confirmChangePassword}>
                <StyleText
                    i18Text="setting.securityAndLogin.buttonChangePass"
                    customStyle={[
                        styles.textButtonCf,
                        {color: theme.textColor},
                    ]}
                />
            </StyleTouchable>
        </View>
    );
};

export default ChangingPassword;

const styles = StyleSheet.create({
    container: {
        width: '90%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    moduleInput: {
        width: '100%',
        paddingVertical: 15,
        borderWidth: 1,
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonConfirm: {
        borderWidth: 2,
        paddingHorizontal: 50,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 15,
    },
    textButtonCf: {
        fontSize: 20,
    },
    styleInput: {
        fontSize: 20,
        paddingHorizontal: 0,
    },
});
