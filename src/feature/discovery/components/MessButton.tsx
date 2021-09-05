import Images from 'asset/img/images';
import {StyleImage, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useRef} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const MessButton = (props?: any) => {
    const theme = Redux.getTheme();
    const opacityMess = useRef(new Animated.Value(0.7)).current;

    const changeOpacityWhenClick = () => {
        // opacityMess.setValue(1);
        // let x = setTimeout(() => {
        //     Animated.timing(opacityMess, {
        //         toValue: 1,
        //         duration: 100,
        //         useNativeDriver: true,
        //     }).start();
        // }, 3000);
        // return () => clearTimeout(x);
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundButtonColor,
                    opacity: opacityMess,
                },
            ]}>
            <StyleTouchable
                customStyle={styles.button}
                onPress={() => {
                    changeOpacityWhenClick();
                    props.onPress();
                }}>
                <StyleImage
                    source={Images.images.logo}
                    customStyle={styles.iconMess}
                />
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        right: '20@s',
        width: '40@vs',
        height: '40@vs',
        borderRadius: '30@vs',
        top: '5@vs',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconMess: {
        width: '50%',
        height: '50%',
    },
});

export default MessButton;
