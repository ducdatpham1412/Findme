import Images from 'asset/img/images';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

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

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {/* GO TO LOGIN */}
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
                        customStyle={[styles.text, {color: theme.textColor}]}
                    />
                    <StyleImage
                        source={Images.images.squirrelLogin}
                        customStyle={styles.imgChoose}
                    />
                </StyleTouchable>
            </Animated.View>

            <Animated.View
                style={[styles.pathBox, {backgroundColor: theme.borderColor}]}
            />

            {/* ENJOY NO ACC_MODE */}
            <Animated.View
                style={[
                    styles.twoSideBox,
                    {
                        transform: [{scale: win}],
                    },
                ]}>
                <StyleTouchable
                    onPress={() => navigate(ROOT_SCREEN.mainScreen)}
                    customStyle={styles.buttonChoose}>
                    <StyleText
                        i18Text="login.loginScreen.enjoyModeNoAcc"
                        customStyle={[styles.text, {color: theme.textColor}]}
                    />
                    <StyleImage
                        source={Images.images.squirrelEnjoy}
                        customStyle={styles.imgChoose}
                    />
                </StyleTouchable>
            </Animated.View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    twoSideBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: '17@ms',
        marginBottom: '20@vs',
    },
    imgChoose: {
        width: '40%',
        height: '40%',
    },
});

export default ChoosingLoginOrEnjoy;
