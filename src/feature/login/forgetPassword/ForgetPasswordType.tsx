import {apiRequestOTP} from 'api/module';
import {RETRIEVE_PASSWORD_TYPE, TYPE_OTP} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import InputBox from 'components/common/InputBox';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {validateIsEmail, validateIsPhone} from 'utility/validate';
import BackgroundAuthen from '../components/BackgroundAuthen';

const ComeToFacebook = () => {
    const theme = Redux.getTheme();

    return (
        <View style={styles.contentView}>
            <StyleTouchable>
                <StyleText
                    i18Text="login.forgetPassword.type.comeToFacebook"
                    customStyle={[
                        styles.textComeToFacebook,
                        {color: theme.textColor},
                    ]}
                />
            </StyleTouchable>
        </View>
    );
};

const EnterUsername = () => {
    const usernameRef = useRef<TextInput>(null);

    const [username, setUsername] = useState('');
    const trimUsername = username.trim();

    const disable =
        !validateIsEmail(trimUsername) && !validateIsPhone(trimUsername);
    const invalidInput = username ? disable : false;

    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const onRequestOTP = async () => {
        try {
            Redux.setIsLoading(true);
            await apiRequestOTP({
                username: trimUsername,
                typeOTP: TYPE_OTP.resetPassword,
            });
            navigate(LOGIN_ROUTE.sendOTP, {
                name: trimUsername,
                isResetPassword: true,
                username: trimUsername,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <View style={styles.contentView}>
            {/* <StyleInput
                ref={usernameRef}
                value={username}
                onChangeText={text => setUsername(text)}
                i18Placeholder="login.forgetPassword.type.username"
                errorMessage={invalidInput ? 'alert.inValidEmail' : ''}
            /> */}
            <InputBox
                i18Placeholder="login.forgetPassword.type.username"
                value={username}
                onChangeText={text => setUsername(text)}
                selectionColor={Theme.darkTheme.textHightLight}
            />

            <StyleButton
                title="login.forgetPassword.type.continue"
                containerStyle={styles.btnSendBox}
                onPress={onRequestOTP}
                disable={disable}
            />
        </View>
    );
};

/**
 * BOSS HERE
 */
const ForgetPasswordType = () => {
    // const theme = Redux.getTheme();
    const insets = useSafeAreaInsets();

    const [typeRetrieve, setTypeRetrieve] = useState(
        RETRIEVE_PASSWORD_TYPE.username,
    );

    // const isApple = typeRetrieve === RETRIEVE_PASSWORD_TYPE.apple;
    // const isFacebook = typeRetrieve === RETRIEVE_PASSWORD_TYPE.facebook;
    // const isUsername = typeRetrieve === RETRIEVE_PASSWORD_TYPE.username;

    // const onChooseTypeRetrieve = (type: number) => {
    //     setTypeRetrieve(type);
    // };

    // render_view
    const RenderForm = useMemo(() => {
        if (typeRetrieve === RETRIEVE_PASSWORD_TYPE.facebook) {
            return <ComeToFacebook />;
        }
        if (typeRetrieve === RETRIEVE_PASSWORD_TYPE.username) {
            return <EnterUsername />;
        }
        return <View />;
    }, [typeRetrieve]);

    return (
        <StyleContainer
            customStyle={styles.container}
            containerStyle={{backgroundColor: Theme.darkTheme.backgroundColor}}
            TopComponent={<BackgroundAuthen />}
            headerProps={{
                title: 'login.forgetPassword.type.header',
                containerStyle: {
                    marginTop: insets?.top || 0,
                    backgroundColor: 'transparent',
                    borderBottomWidth: 0,
                },
                iconStyle: {color: Theme.common.white},
                titleStyle: {color: Theme.common.white},
                onGoBack: () => goBack(),
            }}>
            <BackgroundAuthen />
            {/* <StyleText
                    i18Text="login.forgetPassword.type.chooseMethod"
                    customStyle={[
                        styles.textNotification,
                        {color: theme.textColor},
                    ]}
                /> */}

            {/* facebook, apple or username */}
            {/* <View style={styles.iconsBox}>
                    <View style={{opacity: isFacebook ? 1 : 0.55}}>
                        <IconType
                            source={Images.icons.facebook}
                            title="Facebook"
                            onPress={() =>
                                onChooseTypeRetrieve(
                                    RETRIEVE_PASSWORD_TYPE.facebook,
                                )
                            }
                            disable
                        />
                    </View>

                    <View style={{opacity: isUsername ? 1 : 0.55}}>
                        <IconType
                            source={Images.icons.username}
                            title="login.forgetPassword.type.user"
                            onPress={() =>
                                onChooseTypeRetrieve(
                                    RETRIEVE_PASSWORD_TYPE.username,
                                )
                            }
                        />
                    </View>
                </View> */}

            {/* content view */}
            {RenderForm}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginTop: '50@vs',
    },
    textNotification: {
        fontSize: '17@ms',
        marginTop: '20@vs',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '30@vs',
        justifyContent: 'space-around',
    },
    contentView: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        marginTop: '50@vs',
    },
    // button send otp
    btnSendBox: {
        paddingHorizontal: '30@s',
        marginTop: '70@vs',
    },
    textComeToFacebook: {
        fontSize: '20@ms',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
});

export default ForgetPasswordType;
