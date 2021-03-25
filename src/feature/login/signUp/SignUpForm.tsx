import {yupResolver} from '@hookform/resolvers/yup';
import {signUpType} from 'asset/name';
import {standValue} from 'asset/standardValue';
import {StyleButton, StyleContainer, StyleInputForm} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useRef} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {ScaledSheet} from 'react-native-size-matters';
import {
    yupEmail,
    yupNoName,
    yupPassword,
    yupPhone,
    yupUsername,
} from 'utility/yupSchema';
import * as yup from 'yup';

interface ParamsType {
    typeSignUp: string;
}

const SignUpForm = ({route}: any) => {
    const Redux = useRedux();

    const param: ParamsType = route?.params;
    const {typeSignUp} = param;
    const isFacebook = typeSignUp == signUpType.facebook;
    const isEmail = typeSignUp == signUpType.email;
    const isPhone = typeSignUp == signUpType.phone;

    const passRef = useRef<any>(null);
    const cfPassRef = useRef<any>(null);

    const signUpSchema = yup.object().shape({
        username: yupUsername(),
        password: yupPassword(),
        confirmPass: yupPassword('password'),
        email: isEmail ? yupEmail() : yupNoName(),
        phone: isPhone ? yupPhone() : yupNoName(),
    });

    const form = useForm({
        mode: 'all',
        resolver: yupResolver(signUpSchema),
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    const submitSignUp = (data: any) => {
        Redux.updateLogin({
            username: data?.username,
            password: data?.password,
        });

        if (isFacebook) {
            navigate(LOGIN_ROUTE.sendOTP, {
                // await something
            });
        } else if (isEmail) {
            Redux.updateProfile({contact: {email: data?.email}});
            navigate(LOGIN_ROUTE.sendOTP, {
                // await get VerifyCode
                name: data?.email,
            });
        } else if (isPhone) {
            Redux.updateProfile({contact: {phone: data?.phone}});
            navigate(LOGIN_ROUTE.sendOTP, {
                // await get VerifyCode
                name: data?.phone,
            });
        }
    };

    /**
     * BUTTON_TITLE RETURN A COMPONENT FROM EACH TYPE_SIGN_UP
     */

    return (
        <StyleContainer>
            <FormProvider {...form}>
                <StyleInputForm
                    name="username"
                    i18Placeholder="login.signUp.form.username"
                    containerStyle={styles.inputForm}
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
                />

                {param.typeSignUp == signUpType.email && (
                    <StyleInputForm
                        name="email"
                        i18Placeholder="login.signUp.form.enterEmail"
                        containerStyle={styles.inputForm}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit(submitSignUp)}
                    />
                )}

                {param.typeSignUp == signUpType.phone && (
                    <StyleInputForm
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
