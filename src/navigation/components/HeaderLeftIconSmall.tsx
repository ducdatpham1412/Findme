import Redux from 'hook/useRedux';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderLeft = () => {
    const theme = Redux.getTheme();

    return (
        <Ionicons
            name="ios-chevron-back-outline"
            style={[styles.headerLeft, {color: theme.borderColor}]}
        />
    );
};

const styles = ScaledSheet.create({
    headerLeft: {
        fontSize: '22@ms',
        fontWeight: 'bold',
    },
});

export default HeaderLeft;
