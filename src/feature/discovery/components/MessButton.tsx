import {StyleImage, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useRef} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const MessButton = (props?: any) => {
    const theme = useRedux().getTheme();
    const opacityMess = useRef(new Animated.Value(theme.opacityValue)).current;

    const changeOpacityWhenClick = () => {
        opacityMess.setValue(1);
        setTimeout(() => {
            Animated.timing(opacityMess, {
                toValue: theme.opacityValue,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }, 3000);
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundButtonColor,
                    opacity: opacityMess,
                    top: 0,
                },
            ]}>
            <StyleTouchable
                customStyle={styles.button}
                onPress={() => {
                    changeOpacityWhenClick();
                    props.onPress();
                }}>
                <StyleImage
                    source={theme.icon.discovery.mess}
                    customStyle={styles.iconOwlMess}
                />
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        right: '20@s',
        width: '50@vs',
        height: '50@vs',
        borderRadius: '30@vs',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconOwlMess: {
        width: '70%',
        height: '70%',
    },
});

export default MessButton;
