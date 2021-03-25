import {StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

const PlusButton = (props?: any) => {
    const {onPress} = props;
    const theme = useRedux().getTheme();

    return (
        <View
            style={[
                styles.buttonPlus,
                {backgroundColor: theme.backgroundButtonColor},
            ]}>
            <StyleTouchable onPress={onPress}>
                <Feather
                    name="plus"
                    style={[styles.icon, {color: theme.textColor}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    buttonPlus: {
        position: 'absolute',
        left: '17@vs',
        bottom: '150@vs',
        width: '40@vs',
        height: '40@vs',
        borderRadius: '30@vs',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    },
    icon: {
        fontSize: '30@ms',
    },
});

export default PlusButton;
