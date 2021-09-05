import {signUpType} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleContainer, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from '../components/HeaderLogo';
import IconType from '../components/IconType';

const win = Dimensions.get('screen').width;

const SignUpType = () => {
    const theme = Redux.getTheme();

    const navigateToSignForm = (type: number) => () => {
        if (type === signUpType.facebook || type === signUpType.phone) {
            appAlert('Not support Now');
        } else {
            navigate(LOGIN_ROUTE.signUpForm, {
                typeSignUp: type,
            });
        }
    };

    return (
        <StyleContainer>
            <HeaderLogo />

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
                        source={Images.icons.facebook}
                        title="Facebook"
                        onPress={navigateToSignForm(signUpType.facebook)}
                    />

                    {/* GOOGLE */}
                    <IconType
                        source={Images.icons.email}
                        title="Email"
                        onPress={navigateToSignForm(signUpType.email)}
                    />

                    {/* PHONE */}
                    <IconType
                        source={Images.icons.phone}
                        title="login.signUp.type.phone"
                        onPress={navigateToSignForm(signUpType.phone)}
                    />
                </View>
            </View>
        </StyleContainer>
    );
};

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
        flex: 2.7,
        alignItems: 'center',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '30@vs',
    },
});

export default SignUpType;
