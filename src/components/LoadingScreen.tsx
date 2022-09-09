import Images from 'asset/img/images';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {StyleImage} from './base';

interface Props {
    hasLogo?: boolean;
    opacityBackground?: number;
}

let x: any;

const LoadingScreen = (props: Props) => {
    const aim = useRef(new Animated.Value(0.5)).current;
    const {hasLogo = true, opacityBackground = 0.9} = props;
    const theme = Redux.getTheme();

    const movingLogo = () => {
        x = setInterval(() => {
            Animated.timing(aim, {
                toValue: 1,
                duration: 890,
                useNativeDriver: true,
                easing: Easing.circle,
            }).start(() => aim.setValue(0.5));
        }, 900);
        return () => clearInterval(x);
    };

    useEffect(() => {
        movingLogo();
    }, []);

    // const spin = aim.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ['0deg', '360deg'],
    // });

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    opacity: opacityBackground,
                },
            ]}>
            {hasLogo && (
                <Animated.View
                    style={{
                        // transform: [{rotate: spin}],
                        opacity: aim,
                    }}>
                    <StyleImage source={Images.icons.logo} />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingScreen;
