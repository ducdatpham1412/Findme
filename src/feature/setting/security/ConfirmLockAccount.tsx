import {apiLockAccount} from 'api/module';
import Images from 'asset/img/images';
import {
    StyleButton,
    StyleContainer,
    StyleIcon,
    StyleText,
} from 'components/base';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {appAlert} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AuthenticateService from 'utility/login/loginService';

const ConfirmLockAccount = () => {
    const theme = Redux.getTheme();

    const onLockAccount = async () => {
        try {
            await apiLockAccount();
            await AuthenticateService.logOut({hadRefreshTokenBlacked: false});
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <>
            <StyleHeader title="setting.securityAndLogin.lockAccount" />
            <StyleContainer customStyle={styles.container}>
                <StyleIcon
                    source={Images.images.squirrelEnjoy}
                    size={100}
                    customStyle={styles.iconAlert}
                />

                <View
                    style={[
                        styles.alertView,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}>
                    <StyleText
                        i18Text="setting.securityAndLogin.areYouSureLockAccount"
                        customStyle={[
                            styles.textAlert,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                <StyleButton
                    title="setting.securityAndLogin.continueLock"
                    containerStyle={styles.buttonDelete}
                    onPress={onLockAccount}
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
        paddingHorizontal: '20@s',
    },
});

export default ConfirmLockAccount;
