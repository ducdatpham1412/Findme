import {yupResolver} from '@hookform/resolvers/yup';
import {retrievePassType} from 'asset/name';
import {StyleButton, StyleContainer, StyleInputForm} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {yupEmail, yupNoName, yupUsername} from 'utility/yupSchema';
import * as yup from 'yup';
import HeaderLogo from '../components/HeaderLogo';

const inputSchema = (typeForget: any) => {
    let temptYup: any;
    if (typeForget === retrievePassType.username) {
        temptYup = yupUsername();
    } else if (typeForget === retrievePassType.email) {
        temptYup = yupEmail();
    } else {
        temptYup = yupNoName();
    }

    return yup.object().shape({
        [typeForget]: temptYup,
    });
};

const ForgetPasswordInput = ({route}: any) => {
    const Redux = useRedux();
    const {typeForget} = route.params;

    let placeholder;
    switch (typeForget) {
        case retrievePassType.username:
            placeholder = 'login.forgetPassword.input.username';
            break;
        case retrievePassType.email:
            placeholder = 'login.forgetPassword.input.email';
            break;
        default:
            break;
    }

    const form = useForm({
        mode: 'all',
        resolver: yupResolver(inputSchema(typeForget)),
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    const submit = async (data: any) => {
        const inputText = data[typeForget];

        if (typeForget === retrievePassType.email) {
            // await get username by email and set username to Redux
            Redux.updateLogin({username: 'ducdatpham'});
            navigate(LOGIN_ROUTE.sendOTP, {
                name: data[typeForget],
                isForgetPassOTP: true,
            });
        } else if (typeForget === retrievePassType.username) {
            // await get email by username and set username to Redux
            Redux.updateLogin({username: inputText});
            navigate(LOGIN_ROUTE.sendOTP, {
                name: '**00@gmail.com',
                isForgetPassOTP: true,
            });
        }
    };

    return (
        <StyleContainer>
            <HeaderLogo />

            <View style={styles.inputBox}>
                <FormProvider {...form}>
                    <StyleInputForm
                        name={typeForget}
                        containerStyle={styles.input}
                        i18Placeholder={placeholder}
                        returnKeyType="done"
                    />
                </FormProvider>

                <StyleButton
                    title="login.forgetPassword.input.sendOTP"
                    containerStyle={styles.button}
                    titleStyle={styles.textButton}
                    disable={!isValid}
                    onPress={handleSubmit(submit)}
                />
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    inputBox: {
        flex: 3,
        alignItems: 'center',
    },
    input: {
        marginTop: '40@vs',
    },
    button: {
        marginTop: '40@vs',
        paddingHorizontal: '30@vs',
    },
    textButton: {
        fontSize: 20,
    },
});

export default ForgetPasswordInput;
