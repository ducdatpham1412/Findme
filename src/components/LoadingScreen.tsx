import useRedux from 'hook/useRedux';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const LoadingScreen = () => {
    const theme = useRedux().getTheme();

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: theme.backgroundColor,
            }}>
            <Image source={theme.logo} />
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
