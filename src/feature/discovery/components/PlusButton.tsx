import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

const PlusButton = (props?: any) => {
    const {onPress} = props;
    const theme = Redux.getTheme();

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
        width: '40@ms',
        height: '40@ms',
        borderRadius: '30@vs',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    },
    icon: {
        fontSize: '25@ms',
    },
});

export default PlusButton;
