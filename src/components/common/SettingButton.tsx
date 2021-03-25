import useRedux from 'hook/useRedux';
import React from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface SettingButtonProps {
    customStyle?: any;
    onPress?: any;
}

const SettingButton = (props: SettingButtonProps) => {
    const theme = useRedux().getTheme();
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
            style={{
                ...styles.buttonBox,
                ...customStyle,
                backgroundColor: theme.backgroundButtonColor,
            }}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <AntDesign name="setting" size={30} color={theme.textColor} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default SettingButton;

const styles = StyleSheet.create({
    buttonBox: {
        width: 50,
        height: 50,
        borderRadius: 40,
        opacity: 0.8,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
