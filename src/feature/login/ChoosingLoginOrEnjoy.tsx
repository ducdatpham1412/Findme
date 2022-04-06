import {apiGetIdEnjoyMode, apiGetResource} from 'api/module';
import Images from 'asset/img/images';
import {PRIVACY_URL, TERMS_URL} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from './components/HeaderLogo';

const ChoosingLoginOrEnjoy = () => {
    const theme = Redux.getTheme();
    const win = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(win, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    }, []);

    const onEnjoyModeExp = async () => {
        try {
            const res = await apiGetIdEnjoyMode();
            const resource = await apiGetResource();

            Redux.updatePassport({profile: {id: res.data}});
            Redux.updateResource(resource.data);
            Redux.setToken('enjoy_mode');
            Redux.setModeExp(true);

            navigate(ROOT_SCREEN.mainScreen);
        } catch (err) {
            appAlert(err);
        }
    };

    const onGoToTermsOfUse = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.termsOfUse',
            linkWeb: TERMS_URL,
        });
    };

    const onGoToPrivacyPolicy = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.privacyPolicy',
            linkWeb: PRIVACY_URL,
        });
    };

    /**
     * Render view
     */

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <HeaderLogo />

            <View style={styles.choosingView}>
                {/* Go to login */}
                <Animated.View
                    style={[
                        styles.twoSideBox,
                        {
                            transform: [{scale: win}],
                        },
                    ]}>
                    <StyleTouchable
                        onPress={() => navigate(LOGIN_ROUTE.loginScreen)}
                        customStyle={styles.buttonChoose}>
                        <StyleText
                            i18Text="login.loginScreen.goToLogin"
                            customStyle={[
                                styles.text,
                                {color: theme.textColor},
                            ]}
                        />
                        <StyleImage
                            source={Images.images.squirrelLogin}
                            customStyle={styles.imgChoose}
                            resizeMode="contain"
                        />
                    </StyleTouchable>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.pathBox,
                        {backgroundColor: theme.borderColor},
                    ]}
                />

                {/* Enjoy no acc mode */}
                <Animated.View
                    style={[
                        styles.twoSideBox,
                        {
                            transform: [{scale: win}],
                        },
                    ]}>
                    <StyleTouchable
                        onPress={onEnjoyModeExp}
                        customStyle={styles.buttonChoose}>
                        <StyleText
                            i18Text="login.loginScreen.enjoyModeNoAcc"
                            customStyle={[
                                styles.text,
                                {color: theme.textColor},
                            ]}
                        />
                        <StyleImage
                            source={Images.images.squirrelEnjoy}
                            customStyle={styles.imgChoose}
                            resizeMode="contain"
                        />
                    </StyleTouchable>
                </Animated.View>
            </View>

            <View style={styles.ageeTermsView}>
                <StyleText
                    i18Text="login.loginScreen.byLoginOrTappingEnjoy"
                    customStyle={[
                        styles.textTermAndPolicy,
                        {color: theme.textColor},
                    ]}>
                    {' '}
                    <StyleText
                        i18Text="login.loginScreen.termsOfUse"
                        onPress={onGoToTermsOfUse}
                        customStyle={[
                            styles.textTermAndPolicy,
                            styles.textLink,
                            {color: theme.textColor},
                        ]}
                    />
                    <StyleText
                        i18Text="login.loginScreen.learnMore"
                        onPress={onGoToTermsOfUse}
                        customStyle={[
                            styles.textTermAndPolicy,
                            {color: theme.textColor},
                        ]}
                    />{' '}
                    <StyleText
                        i18Text="login.loginScreen.privacyPolicy"
                        onPress={onGoToPrivacyPolicy}
                        customStyle={[
                            styles.textTermAndPolicy,
                            styles.textLink,
                            {color: theme.textColor},
                        ]}
                    />
                    {'.'}
                </StyleText>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: '30@vs',
    },
    choosingView: {
        flexDirection: 'row',
        marginTop: '40@vs',
    },
    twoSideBox: {
        flex: 1,
        alignItems: 'center',
    },
    buttonChoose: {
        width: '100%',
        height: '150@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pathBox: {
        width: 1,
        height: '150@vs',
    },
    text: {
        fontSize: '13@ms',
        marginBottom: '20@vs',
        textAlign: 'center',
    },
    imgChoose: {
        width: '40%',
        height: '40%',
    },
    ageeTermsView: {
        width: '100%',
        marginTop: '70@vs',
        paddingHorizontal: '30@s',
    },
    textTermAndPolicy: {
        fontSize: '10@ms',
        lineHeight: '20@ms',
        textAlign: 'center',
    },
    textLink: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default ChoosingLoginOrEnjoy;
