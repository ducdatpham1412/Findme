import {StyleImage, StyleText} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface HeaderLogoProps {
    hasLogo?: boolean;
    hasName?: boolean;
    hasSlogan?: boolean;
}

const HeaderLogo = (props: HeaderLogoProps) => {
    const theme = useRedux().getTheme();
    const {hasLogo = true, hasName = false, hasSlogan = false} = props;

    return (
        <View style={styles.logo}>
            {hasLogo && (
                <StyleImage customStyle={styles.logoImg} source={theme.logo} />
            )}

            {hasName && (
                <StyleText
                    originValue="Findme"
                    customStyle={[styles.logoText, {color: theme.borderColor}]}
                />
            )}

            {hasSlogan && (
                <StyleText
                    i18Text="login.loginScreen.slogan"
                    customStyle={[
                        styles.sloganText,
                        {color: theme.borderColor},
                    ]}
                />
            )}
        </View>
    );
};

const styles = ScaledSheet.create({
    logo: {
        width: '100%',
        minHeight: '130@vs',
        paddingVertical: '15@vs',
        alignItems: 'center',
        justifyContent: 'center',
    }, // Logo and Slogan part
    logoImg: {
        width: '50%',
        height: '80@vs',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sloganText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});

export default HeaderLogo;
