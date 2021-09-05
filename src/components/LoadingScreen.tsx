import Images from 'asset/img/images';
import Redux from 'hook/useRedux';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

interface LoadingProps {
    hasLogo?: boolean;
}

const LoadingScreen = (props: LoadingProps) => {
    const {hasLogo = true} = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {hasLogo && <Image source={Images.icons.logo} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingScreen;
