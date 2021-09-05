import {retrievePassType} from 'asset/enum';
import Images from 'asset/img/images';
import {standValue} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from '../components/HeaderLogo';
import IconType from '../components/IconType';

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
    const [username, setUsername] = useState('');

    const disable =
        username.length > standValue.USERNAME_MAX_LENGTH ||
        username.length < standValue.USERNAME_MIN_LENGTH;

    const navigateToSendOTP = () => {
        navigate(LOGIN_ROUTE.forgetPasswordSend, {
            username,
        });
    };

    return (
        <View style={styles.contentView}>
            <StyleInput
                value={username}
                onChangeText={text => setUsername(text)}
                i18Placeholder="login.forgetPassword.type.username"
            />

            <StyleButton
                title="login.forgetPassword.type.continue"
                containerStyle={styles.btnSendBox}
                onPress={navigateToSendOTP}
                disable={disable}
            />
        </View>
    );
};

/**
 * BOSS HERE
 */
const ForgetPasswordType = () => {
    const theme = Redux.getTheme();

    const [typeRetrieve, setTypeRetrieve] = useState(retrievePassType.username);

    const isFacebook = typeRetrieve === retrievePassType.facebook;
    const isUsername = typeRetrieve === retrievePassType.username;

    const onChooseTypeRetrieve = (type: number) => {
        setTypeRetrieve(type);
    };

    return (
        <StyleContainer extraHeight={230}>
            {/* HEADER AND LOGO */}
            <HeaderLogo />

            {/* CONTENT PART */}
            <View style={styles.content}>
                {/* TEXT */}
                <StyleText
                    i18Text="login.forgetPassword.type.chooseMethod"
                    customStyle={[
                        styles.textNotification,
                        {color: theme.textColor},
                    ]}
                />

                {/* FACEBOOK, GOOGLE OR PHONE */}
                <View style={styles.iconsBox}>
                    {/* FACEBOOK */}
                    <View style={{opacity: isFacebook ? 1 : 0.55}}>
                        <IconType
                            source={Images.icons.facebook}
                            title="Facebook"
                            onPress={() =>
                                onChooseTypeRetrieve(retrievePassType.facebook)
                            }
                        />
                    </View>

                    {/* USERNAME */}
                    <View style={{opacity: isUsername ? 1 : 0.55}}>
                        <IconType
                            source={Images.icons.username}
                            title="login.forgetPassword.type.user"
                            onPress={() =>
                                onChooseTypeRetrieve(retrievePassType.username)
                            }
                        />
                    </View>
                </View>

                {/* CONTENT VIEW */}
                {isFacebook && <ComeToFacebook />}

                {isUsername && <EnterUsername />}
            </View>
        </StyleContainer>
    );
};

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
    textNotification: {
        fontSize: '20@ms',
        marginTop: '20@vs',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '30@vs',
        justifyContent: 'space-around',
    },
    contentView: {
        width: '100%',
        alignItems: 'center',
        marginTop: '50@vs',
    },
    // button send otp
    btnSendBox: {
        paddingHorizontal: '30@s',
        marginTop: '20@vs',
    },
    textComeToFacebook: {
        fontSize: '20@ms',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
});

export default ForgetPasswordType;
