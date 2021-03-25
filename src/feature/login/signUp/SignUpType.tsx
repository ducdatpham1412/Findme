import {signUpType} from 'asset/name';
import {StyleContainer, StyleImage, StyleText} from 'components/base';
import useRedux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import IconType from '../components/IconType';

const win = Dimensions.get('screen').width;

const SignUpType = () => {
    const Redux = useRedux();
    const theme = Redux.getTheme();

    const navigateToSignForm = (type: string) => () => {
        if (type == signUpType.facebook || type == signUpType.phone) {
            appAlert('Not support Now');
        } else {
            navigate(LOGIN_ROUTE.signUpForm, {
                typeSignUp: type,
            });
        }
    };

    return (
        <StyleContainer>
            {/* HEADER AND LOGO */}
            <View style={styles.logo}>
                <StyleImage
                    source={theme.logo}
                    customStyle={styles.imageLogo}
                />
            </View>

            {/* CONTENT PART */}
            <View style={styles.content}>
                <StyleText
                    i18Text="login.signUp.type.chooseMethod"
                    customStyle={[
                        styles.textChooseMethod,
                        {color: theme.textColor},
                    ]}
                />

                {/* FACEBOOK, GOOGLE OR PHONE */}
                <View style={styles.iconsBox}>
                    {/* FACEBOOK */}
                    <IconType
                        source={theme.icon.signUp.facebook}
                        originTitle="Facebook"
                        onPress={navigateToSignForm(signUpType.facebook)}
                    />

                    {/* GOOGLE */}
                    <IconType
                        source={theme.icon.signUp.google}
                        originTitle="Email"
                        onPress={navigateToSignForm(signUpType.email)}
                    />

                    {/* PHONE */}
                    <IconType
                        source={theme.icon.signUp.phone}
                        i18Title="login.signUp.type.phone"
                        onPress={navigateToSignForm(signUpType.phone)}
                    />
                </View>
            </View>
        </StyleContainer>
    );
};

export default SignUpType;

const styles = ScaledSheet.create({
    logo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageLogo: {
        width: win / 2.5,
        height: '100@vs',
    },
    textChooseMethod: {
        fontSize: 20,
        marginTop: '25@vs',
    },
    content: {
        flex: 3,
        alignItems: 'center',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '30@vs',
    },
});
