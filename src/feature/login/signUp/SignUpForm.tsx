import {yupResolver} from '@hookform/resolvers/yup';
import {TypeRegisterReq, TypeRequestOTPRequest} from 'api/interface';
import {apiRequestOTP} from 'api/module';
import {SIGN_UP_TYPE, TYPE_OTP} from 'asset/enum';
import {standValue, TERMS_URL} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleInputForm,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';

interface SignUpFormProps {
    route: {
        params: {
            typeSignUp: number;
        };
    };
}

const defaultFormSignUp = __DEV__
    ? {
          username: 'yeuquaimo@gmail.com',
          password: '12345678',
          confirmPass: '12345678',
      }
    : {};

const SignUpForm = ({route}: SignUpFormProps) => {
    const {typeSignUp} = route.params;
    const theme = Redux.getTheme();

    // const isApple = typeSignUp === SIGN_UP_TYPE.apple;
    // const isFacebook = typeSignUp === SIGN_UP_TYPE.facebook;
    const isEmail = typeSignUp === SIGN_UP_TYPE.email;
    const isPhone = typeSignUp === SIGN_UP_TYPE.phone;

    const usernameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [haveAgreed, setHaveAgreed] = useState(false);

    const chooseYupUsername = useCallback(() => {
        if (isEmail) {
            return yupValidate.email();
        }
        if (isPhone) {
            return yupValidate.phone();
        }
        return yupValidate.default();
    }, [isEmail, isPhone]);

    const signUpSchema = useMemo(() => {
        return yup.object().shape({
            username: chooseYupUsername(),
            password: yupValidate.password(),
            confirmPass: yupValidate.password(),
        });
    }, [isEmail, isPhone]);

    const form = useForm({
        mode: 'all',
        resolver: yupResolver(signUpSchema),
        defaultValues: defaultFormSignUp,
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const onSignUp = async (data: any) => {
        const itemSignUp: TypeRegisterReq = {
            facebook: '',
            email: isEmail ? data.username : '',
            phone: isPhone ? data.username : '',
            password: data.password,
            confirmPassword: data.confirmPass,
        };

        // params to check code
        const params: TypeRequestOTPRequest = {
            username: data.username,
            targetInfo: typeSignUp,
            password: data.password,
            confirmPassword: data.confirmPass,
            typeOTP: TYPE_OTP.register,
        };

        try {
            Redux.setIsLoading(true);
            await apiRequestOTP(params);
            navigate(LOGIN_ROUTE.sendOTP, {
                name: data.username,
                itemSignUp,
                paramsOTP: params,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    const UserNameHolder = useMemo(() => {
        if (isEmail) {
            return 'login.signUp.form.enterEmail';
        }
        if (isPhone) {
            return 'login.signUp.form.enterPhone';
        }
        return '';
    }, []);

    const RenderButtonCheckAgree = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={[
                    styles.boxTappingAgree,
                    {borderColor: theme.borderColor},
                ]}
                onPress={() => setHaveAgreed(!haveAgreed)}>
                {haveAgreed && (
                    <AntDesign
                        name="check"
                        style={[styles.iconCheck, {color: theme.textColor}]}
                    />
                )}
            </StyleTouchable>
        );
    }, [haveAgreed]);

    const RenderTitleCheckAgree = useMemo(() => {
        return (
            <View style={styles.boxTitleAgree}>
                <StyleText
                    i18Text="login.signUp.hadReadAndAgree"
                    customStyle={[styles.titleAgree, {color: theme.textColor}]}>
                    {' '}
                    <StyleText
                        i18Text="login.signUp.doffyTermsAndPolicy"
                        customStyle={[
                            styles.titleAgree,
                            {
                                color: theme.textColor,
                                textDecorationLine: 'underline',
                                fontWeight: 'bold',
                            },
                        ]}
                        onPress={() =>
                            navigate(ROOT_SCREEN.webView, {
                                title: 'setting.aboutUs.termsOfUse',
                                linkWeb: TERMS_URL,
                            })
                        }
                    />
                </StyleText>
            </View>
        );
    }, []);

    return (
        <StyleContainer>
            <FormProvider {...form}>
                <StyleInputForm
                    ref={usernameRef}
                    name="username"
                    i18Placeholder={UserNameHolder}
                    containerStyle={[
                        styles.inputForm,
                        {marginTop: verticalScale(35)},
                    ]}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                />

                <StyleInputForm
                    ref={passwordRef}
                    name="password"
                    i18Placeholder="login.signUp.form.password"
                    containerStyle={styles.inputForm}
                    secureTextEntry
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />

                <StyleInputForm
                    ref={confirmPasswordRef}
                    name="confirmPass"
                    i18Placeholder="login.signUp.form.confirmPass"
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    secureTextEntry
                />
            </FormProvider>

            <View style={styles.termPolicyView}>
                {RenderButtonCheckAgree}
                {RenderTitleCheckAgree}
            </View>

            <StyleButton
                title="login.signUp.form.confirmButton"
                containerStyle={styles.button}
                onPress={handleSubmit(onSignUp)}
                disable={!isValid || !haveAgreed}
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
        marginTop: '30@vs',
        width: '85%',
    },
    // terms and policy
    termPolicyView: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '20@s',
        marginTop: '30@vs',
    },
    boxTappingAgree: {
        width: '20@ms',
        height: '20@ms',
        borderWidth: '0.5@s',
        borderRadius: '4@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCheck: {
        fontSize: '15@ms',
    },
    boxTitleAgree: {
        flex: 1,
        paddingLeft: '7@s',
    },
    titleAgree: {
        fontSize: '14@ms',
        lineHeight: '20@ms',
    },
    // button
    button: {
        paddingHorizontal: '35@vs',
        marginTop: '60@vs',
    },
});

export default SignUpForm;
