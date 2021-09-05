import Redux from 'hook/useRedux';
import React from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface OptionsButtonProps {
    customStyle?: any;
    onPress?: any;
}

const OptionsButton = (props: OptionsButtonProps) => {
    const theme = Redux.getTheme();
    const {customStyle, onPress} = props;

    // const opacityMess = useRef(new Animated.Value(theme.opacityValue)).current

    // const changeOpacityWhenClick = () => {
    //     opacityMess.setValue(1)
    //     setTimeout(() => {
    //         Animated.timing(opacityMess, {
    //             toValue: theme.opacityValue,
    //             duration: 100,
    //             useNativeDriver: true
    //         }).start()
    //     }, 3000);
    // }

    return (
        <Animated.View
            style={[
                styles.buttonBox,
                customStyle,
                {backgroundColor: theme.backgroundButtonColor},
            ]}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <AntDesign
                    name="bars"
                    style={[styles.icon, {color: theme.textColor}]}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    buttonBox: {
        width: '33@vs',
        height: '33@vs',
        borderRadius: '20@s',
        opacity: 0.8,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '20@ms',
    },
});

export default OptionsButton;
