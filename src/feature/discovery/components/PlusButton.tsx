import {Metrics} from 'asset/metrics';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
    onPress(): void;
}

const PlusButton = (props: Props) => {
    const {onPress} = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.buttonPlus,
                {backgroundColor: theme.backgroundButtonColor},
            ]}>
            <StyleTouchable onPress={onPress}>
                <MaterialIcons
                    name="bubble-chart"
                    style={[styles.icon, {color: theme.textColor}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    buttonPlus: {
        position: 'absolute',
        left: '10@vs',
        bottom: Metrics.height / 2 - verticalScale(50),
        width: '40@ms',
        height: '40@ms',
        borderRadius: '30@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '25@ms',
    },
});

export default PlusButton;
