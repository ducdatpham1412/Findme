import {StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const SwitchToSignUp = () => {
    const theme = useRedux().getTheme();

    return (
        <View style={styles.container}>
            <StyleText
                i18Text="login.loginScreen.notHaveAcc"
                customStyle={[
                    styles.notHaveAccText,
                    {color: theme.borderColor},
                ]}
            />
            <StyleTouchable onPress={() => navigate(LOGIN_ROUTE.signUpType)}>
                <StyleText
                    i18Text="login.loginScreen.signUp"
                    customStyle={[styles.signUpText, {color: theme.textColor}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: '20@vs',
    },
    notHaveAccText: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    signUpText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default SwitchToSignUp;
