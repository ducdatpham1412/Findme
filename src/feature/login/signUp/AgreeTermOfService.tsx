import {TypeRegisterReq} from 'api/interface';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleButton, StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlertYesNo, goBack} from 'navigation/NavigationService';
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
        goBack(); // go back to out screen alert yes or no

        await AuthenticateService.requestLogin({
            username: itemSignUp.email || itemSignUp.phone,
            password: itemSignUp.password,
            isKeepSign: isKeep,
        });
    };

    const confirmTermsOfService = async () => {
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
            <StyleImage
                source={Images.images.successful}
                customStyle={styles.imageSuccess}
            />

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
    imageSuccess: {
        width: Metrics.width / 2,
        height: Metrics.width / 2,
        marginRight: '20@s',
        marginTop: '50@vs',
    },
    buttonLetGo: {
        marginTop: '70@vs',
    },
});

export default AgreeTermOfService;
