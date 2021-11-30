import {apiRequestOTP} from 'api/module';
import {TYPE_OTP} from 'asset/enum';
import Images from 'asset/img/images';
import {
    StyleButton,
    StyleContainer,
    StyleIcon,
    StyleText,
} from 'components/base';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    route: {
        params: {
            username: string;
        };
    };
}

const ConfirmOpenAccount = ({route}: Props) => {
    const theme = Redux.getTheme();

    const onOpenAccount = async () => {
        try {
            Redux.setIsLoading(true);
            await apiRequestOTP({
                username: route.params.username,
                typeOTP: TYPE_OTP.requestOpenAccount,
            });
            navigate(LOGIN_ROUTE.sendOTP, {
                name: route.params.username,
                isOpenAccount: true,
                username: route.params.username,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <>
            <StyleHeader title="setting.securityAndLogin.lockAccount" />
            <StyleContainer customStyle={styles.container}>
                <StyleIcon
                    source={Images.images.successful}
                    size={100}
                    customStyle={styles.iconAlert}
                />

                <View
                    style={[
                        styles.alertView,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}>
                    <StyleText
                        i18Text="login.loginScreen.yourAccountIsBeingLock"
                        customStyle={[
                            styles.textAlert,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                <StyleButton
                    title="login.loginScreen.continue"
                    containerStyle={styles.buttonDelete}
                    onPress={onOpenAccount}
                />
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '20@s',
        alignItems: 'center',
    },
    alertView: {
        paddingHorizontal: '10@s',
        paddingVertical: '30@vs',
        borderRadius: '14@s',
        marginTop: '40@vs',
    },
    textAlert: {
        fontSize: '14@ms',
    },
    iconAlert: {
        marginTop: '30@vs',
    },
    buttonDelete: {
        marginTop: '60@vs',
        paddingHorizontal: '40@s',
    },
});

export default ConfirmOpenAccount;
