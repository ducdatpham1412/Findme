import {yupResolver} from '@hookform/resolvers/yup';
import {apiResetPassword} from 'api/module';
import {standValue} from 'asset/standardValue';
import {StyleButton, StyleContainer, StyleInputForm} from 'components/base';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useRef} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {TextInput} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';

const ForgetPasswordForm = ({route}: any) => {
    const {username} = route.params;

    const newRef = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

    const passwordSchema = yup.object().shape({
        newPass: yupValidate.password(),
        confirmPass: yupValidate.password('newPass'),
    });
    const form = useForm({
        mode: 'all',
        resolver: yupResolver(passwordSchema),
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    const submitChangePass = async (data: any) => {
        try {
            await apiResetPassword({
                username,
                newPassword: data.newPass,
                confirmPassword: data.confirmPass,
            });
            appAlert('alert.successChangePass', () =>
                navigate(LOGIN_ROUTE.loginScreen),
            );
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <StyleContainer>
            <FormProvider {...form}>
                <StyleInputForm
                    name="username"
                    value={username}
                    containerStyle={styles.inputForm}
                    editable={false}
                />

                <StyleInputForm
                    ref={newRef}
                    name="newPass"
                    i18Placeholder="login.forgetPassword.form.newPass"
                    secureTextEntry={true}
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    onSubmitEditing={() => confirmRef.current?.focus()}
                />

                <StyleInputForm
                    ref={confirmRef}
                    name="confirmPass"
                    i18Placeholder="login.forgetPassword.form.confirmPass"
                    secureTextEntry={true}
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                />
            </FormProvider>

            <StyleButton
                title="login.forgetPassword.form.buttonDone"
                containerStyle={styles.buttonConfirm}
                disable={!isValid}
                onPress={handleSubmit(submitChangePass)}
            />
        </StyleContainer>
    );
};
export default ForgetPasswordForm;

const styles = ScaledSheet.create({
    inputForm: {
        marginTop: '20@vs',
        width: '85%',
    },
    buttonConfirm: {
        marginTop: '10%',
        paddingHorizontal: '40@vs',
    },
    textButton: {
        fontSize: 25,
    },
});
