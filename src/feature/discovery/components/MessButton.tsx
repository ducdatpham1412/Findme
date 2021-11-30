import Images from 'asset/img/images';
import {StyleImage, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    onPress(): void;
    opacity: number;
}

const MessButton = ({onPress, opacity}: Props) => {
    const theme = Redux.getTheme();
    const numberNewMessages = Redux.getNumberNewMessages();

    const tintColor =
        numberNewMessages > 0 ? theme.highlightColor : theme.textColor;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundButtonColor,
                    opacity: opacity,
                },
            ]}>
            <StyleTouchable customStyle={styles.button} onPress={onPress}>
                <StyleImage
                    source={Images.images.logo}
                    customStyle={[styles.iconMess, {tintColor}]}
                />
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        right: '10@s',
        width: '40@ms',
        height: '40@ms',
        borderRadius: '30@ms',
        top: '2@vs',
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

export default memo(MessButton);
