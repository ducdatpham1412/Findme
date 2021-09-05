import {yupResolver} from '@hookform/resolvers/yup';
import {TypeRequestOTPRequest} from 'api/interface';
import {apiRequestOTP} from 'api/module';
import {signUpType, TYPE_OTP} from 'asset/enum';
import {standValue} from 'asset/standardValue';
import {StyleButton, StyleContainer, StyleInputForm} from 'components/base';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useRef} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';

interface SignUpFormProps {
    route: {
        params: {
            typeSignUp: number;
        };
    };
}

const SignUpForm = ({route}: SignUpFormProps) => {
    const {typeSignUp} = route.params;

    const isFacebook = typeSignUp === signUpType.facebook;
    const isEmail = typeSignUp === signUpType.email;
    const isPhone = typeSignUp === signUpType.phone;

    const passRef = useRef<any>(null);
    const cfPassRef = useRef<any>(null);
    const infoRef = useRef<any>(null);

    const signUpSchema = yup.object().shape({
        username: yupValidate.username(),
        password: yupValidate.password(),
        confirmPass: yupValidate.password('password'),
        email: isEmail ? yupValidate.email() : yupValidate.default(),
        phone: isPhone ? yupValidate.phone() : yupValidate.default(),
    });

    const form = useForm({
        mode: 'all',
        resolver: yupResolver(signUpSchema),
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    const submitSignUp = async (data: any) => {
        const itemSignUp = {
            username: data.username,
            password: data.password,
            facebook: '',
            email: '',
            phone: '',
        };
        let name = '';

        // params to check code
        const params: TypeRequestOTPRequest = {
            username: itemSignUp.username,
            destination: '',
            targetInfo: typeSignUp,
            typeOTP: TYPE_OTP.register,
            password: data.password,
            confirmPassword: data.confirmPass,
        };

        if (isFacebook) {
            navigate(LOGIN_ROUTE.sendOTP, {
                // await something
            });
        } else if (isEmail) {
            itemSignUp.email = data.email;
            params.destination = data.email;
            name = data.email;
        } else if (isPhone) {
            itemSignUp.phone = data.phone;
            params.destination = data.phone;
            name = data.phone;
        }

        try {
            await apiRequestOTP(params);

            navigate(LOGIN_ROUTE.sendOTP, {
                name,
                itemSignUp,
                paramsOTP: params,
            });
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <StyleContainer>
            <FormProvider {...form}>
                <StyleInputForm
                    name="username"
                    i18Placeholder="login.signUp.form.username"
                    containerStyle={[
                        styles.inputForm,
                        {marginTop: verticalScale(35)},
                    ]}
                    maxLength={standValue.USERNAME_MAX_LENGTH}
                    onSubmitEditing={() => passRef.current.focus()}
                />

                <StyleInputForm
                    ref={passRef}
                    name="password"
                    i18Placeholder="login.signUp.form.password"
                    containerStyle={styles.inputForm}
                    secureTextEntry={true}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    onSubmitEditing={() => cfPassRef.current.focus()}
                />

                <StyleInputForm
                    ref={cfPassRef}
                    name="confirmPass"
                    i18Placeholder="login.signUp.form.confirmPass"
                    containerStyle={styles.inputForm}
                    secureTextEntry={true}
                    onSubmitEditing={() => infoRef.current.focus()}
                />

                {isEmail && (
                    <StyleInputForm
                        ref={infoRef}
                        name="email"
                        i18Placeholder="login.signUp.form.enterEmail"
                        containerStyle={styles.inputForm}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit(submitSignUp)}
                    />
                )}

                {isPhone && (
                    <StyleInputForm
                        ref={infoRef}
                        name="phone"
                        i18Placeholder="login.signUp.form.enterPhone"
                        containerStyle={styles.inputForm}
                        keyboardType="numeric"
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit(submitSignUp)}
                    />
                )}
            </FormProvider>

            <StyleButton
                title="login.signUp.form.confirmButton"
                containerStyle={styles.button}
                onPress={handleSubmit(submitSignUp)}
                disable={!isValid}
            />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    inputForm: {
        marginTop: '20@vs',
        width: '85%',
    },
    button: {
        paddingHorizontal: '35@vs',
        marginTop: '10%',
    },
});

export default SignUpForm;
