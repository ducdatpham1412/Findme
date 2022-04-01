import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface OptionsButtonProps {
    customStyle?: any;
    onPress?: any;
}

const OptionsButton = (props: OptionsButtonProps) => {
    const theme = Redux.getTheme();
    const {customStyle, onPress} = props;

    return (
        <StyleTouchable
            customStyle={[
                styles.buttonBox,
                customStyle,
                {backgroundColor: theme.backgroundButtonColor},
            ]}
            onPress={onPress}>
            <AntDesign
                name="bars"
                style={[styles.icon, {color: theme.textColor}]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    buttonBox: {
        width: '33@vs',
        height: '33@vs',
        borderRadius: '20@s',
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flex: 1,
    },
    icon: {
        fontSize: '20@ms',
    },
});

export default OptionsButton;
