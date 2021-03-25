import {retrievePassType} from 'asset/name';
import {StyleContainer, StyleImage, StyleText} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from '../components/HeaderLogo';
import IconType from '../components/IconType';

const ForgetPasswordType = () => {
    const Redux = useRedux();
    const theme = Redux.getTheme();

    const onGoRetrieve = (type: string) => () => {
        if (
            type == retrievePassType.facebook ||
            type == retrievePassType.phone
        ) {
            appAlert('Not support now');
        } else {
            navigate(LOGIN_ROUTE.forgetPasswordInput, {
                typeForget: type,
            });
        }
    };

    return (
        <StyleContainer>
            {/* HEADER AND LOGO */}
            <HeaderLogo />

            {/* CONTENT PART */}
            <View style={styles.content}>
                {/* TEXT */}
                <StyleText
                    i18Text="login.forgetPassword.type.chooseMethod"
                    customStyle={[styles.textNoti, {color: theme.textColor}]}
                />

                {/* FACEBOOK, GOOGLE OR PHONE */}
                <View style={styles.iconsBox}>
                    {/* FACEBOOK */}
                    <IconType
                        source={theme.icon.signUp.facebook}
                        originTitle="Facebook"
                        onPress={onGoRetrieve(retrievePassType.facebook)}
                    />

                    {/* USERNAME */}
                    <IconType
                        source={theme.icon.signUp.user}
                        i18Title="login.forgetPassword.type.user"
                        onPress={onGoRetrieve(retrievePassType.username)}
                    />

                    {/* GOOGLE */}
                    <IconType
                        source={theme.icon.signUp.google}
                        originTitle="Email"
                        onPress={onGoRetrieve(retrievePassType.email)}
                    />

                    {/* PHONE */}
                    <IconType
                        source={theme.icon.signUp.phone}
                        i18Title="login.forgetPassword.type.phone"
                        onPress={onGoRetrieve(retrievePassType.phone)}
                    />
                </View>
            </View>
        </StyleContainer>
    );
};

export default ForgetPasswordType;

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 2.4,
        alignItems: 'center',
    },

    textNoti: {
        fontSize: 20,
        marginTop: '20@vs',
    },

    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '30@vs',
    },
});
