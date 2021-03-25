import {yupResolver} from '@hookform/resolvers/yup';
import ChangePassword from 'api/actions/setting/ChangePassword';
import {standValue} from 'asset/standardValue';
import {StyleButton, StyleContainer, StyleInputForm} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {ScaledSheet} from 'react-native-size-matters';
import {yupPassword} from 'utility/yupSchema';
import * as yup from 'yup';

const ForgetPasswordForm = () => {
    const {username} = useRedux().getLogin();
    console.log(username);

    const passwordSchema = yup.object().shape({
        newPass: yupPassword(),
        confirmPass: yupPassword('newPass'),
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
            await ChangePassword.changePassword(data.newPass);
            navigate(LOGIN_ROUTE.loginScreen);
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
                    name="newPass"
                    i18Placeholder="login.forgetPassword.form.newPass"
                    secureTextEntry={true}
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                />

                <StyleInputForm
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
