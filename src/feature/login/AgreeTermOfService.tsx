import {TypeRegisterReq} from 'api/interface';
import {apiRegister} from 'api/module';
import Images from 'asset/img/images';
import {StyleButton, StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert, appAlertYesNo} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AuthenticateService from 'utility/login/loginService';

interface Props {
    route: {
        params: {
            itemSignUp: TypeRegisterReq;
        };
    };
}

const AgreeTermOfService = ({route}: Props) => {
    const {itemSignUp} = route.params;
    const theme = Redux.getTheme();

    const onRegisterAndGo = async (isKeep: boolean) => {
        try {
            await apiRegister(itemSignUp);
            await AuthenticateService.requestLogin({
                username: itemSignUp.username,
                password: itemSignUp.password,
                isKeepSign: isKeep,
            });
        } catch (err) {
            appAlert(err);
        }
    };

    const confirmTermsOfService = () => {
        appAlertYesNo({
            i18Title: 'alert.wantToSave',
            agreeChange: () => onRegisterAndGo(true),
            refuseChange: () => onRegisterAndGo(false),
        });
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleImage source={Images.images.signUpNow} />
            <StyleButton
                title="login.agreeTermOfService.agreeTermOfService"
                containerStyle={styles.buttonLetGo}
                onPress={confirmTermsOfService}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonLetGo: {
        marginTop: '100@vs',
    },
});

export default AgreeTermOfService;
