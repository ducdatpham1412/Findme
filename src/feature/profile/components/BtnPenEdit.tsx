import {StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface BtnPenEditProps {
    btnStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onPress(): void;
}

const BtnPenEdit = (props: BtnPenEditProps) => {
    const {btnStyle, iconStyle, onPress} = props;
    const theme = useRedux().getTheme();

    return (
        <StyleTouchable
            onPress={onPress}
            customStyle={[styles.touch, btnStyle]}
            customOpacity={0.8}>
            <AntDesign
                name="edit"
                style={[
                    {
                        fontSize: moderateScale(23),
                        color: theme.backgroundButtonColor,
                    },
                    iconStyle,
                ]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    touch: {
        width: '50@s',
        height: '50@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BtnPenEdit;
