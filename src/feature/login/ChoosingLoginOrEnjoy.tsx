import {StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

const ChoosingLoginOrEnjoy = () => {
    const theme = useRedux().getTheme();
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
                    onPress={() => navigate(LOGIN_ROUTE.loginScreen)}>
                    <StyleText
                        i18Text="Login"
                        customStyle={[styles.text, {color: theme.textColor}]}
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
                    onPress={() => navigate(ROOT_SCREEN.mainScreen)}>
                    <StyleText
                        i18Text="login.loginScreen.enjoyModeNoAcc"
                        customStyle={[styles.text, {color: theme.textColor}]}
                    />
                </StyleTouchable>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    twoSideBox: {
        flex: 1,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pathBox: {
        width: 1,
        height: 200,
    },
    text: {
        fontSize: 25,
    },
});

export default ChoosingLoginOrEnjoy;
