import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface RemForPassProps {
    isKeepSignIn: boolean;
    onClickKeepSignIn(): void;
}

const RemForPass = (props: RemForPassProps) => {
    const {isKeepSignIn, onClickKeepSignIn} = props;
    const theme = Redux.getTheme();

    return (
        <View style={styles.remember_forgotPassword}>
            {/* REMEMBER */}
            <View style={styles.rememberView}>
                <StyleTouchable
                    customStyle={[
                        styles.rememberButton,
                        {borderColor: theme.borderColor},
                    ]}
                    onPress={onClickKeepSignIn}>
                    {isKeepSignIn && (
                        <AntDesign
                            name="check"
                            style={[
                                styles.checkIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    )}
                </StyleTouchable>

                <StyleText
                    i18Text="login.loginScreen.keepSignIn"
                    customStyle={[
                        styles.keepSignInText,
                        {color: theme.borderColor},
                    ]}
                />
            </View>

            {/* FORGOT */}
            <StyleTouchable
                customStyle={styles.forgotButton}
                onPress={() => navigate(LOGIN_ROUTE.forgetPasswordType)}>
                <StyleText
                    i18Text="login.loginScreen.forgotPass"
                    customStyle={[
                        styles.forgotButtonText,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    remember_forgotPassword: {
        width: '85%',
        flexDirection: 'row',
        marginVertical: '20@vs',
    },
    rememberView: {
        flexDirection: 'row',
    },
    rememberButton: {
        width: '20@vs',
        height: '20@vs',
        borderWidth: 0.5,
        borderRadius: '5@vs',
        marginRight: '7@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        fontSize: '20@ms',
    },
    keepSignInText: {
        fontSize: '15@ms',
    },
    forgotButton: {
        position: 'absolute',
        right: 0,
    },
    forgotButtonText: {
        fontSize: '15@ms',
        fontStyle: 'italic',
    },
});

export default RemForPass;
