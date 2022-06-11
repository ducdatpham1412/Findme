import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleText} from 'components/base';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {TypeItemLoginSuccess} from 'utility/login/loginService';
import BackgroundAuthen from '../components/BackgroundAuthen';

interface Props {
    route: {
        params: {
            itemLoginSuccess: TypeItemLoginSuccess;
        };
    };
}

const EditBasicInformation = ({route}: Props) => {
    const {itemLoginSuccess} = route.params;

    return (
        <View style={styles.container}>
            <BackgroundAuthen />
            <View style={styles.spaceBackground} />
            <StyleText
                i18Text="login.detailInformation.title"
                customStyle={styles.titleText}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    spaceBackground: {
        width: '100%',
        height: Metrics.safeTopPadding + verticalScale(70),
    },
    titleText: {
        fontSize: '30@ms',
        color: Theme.common.white,
    },
});

export default EditBasicInformation;
