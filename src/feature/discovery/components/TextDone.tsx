import {StyleText} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {memo} from 'react';
import {ScaledSheet} from 'react-native-size-matters';

const TextDone = memo(() => {
    const theme = useRedux().getTheme();
    return (
        <StyleText
            i18Text="discovery.heart.done"
            customStyle={[styles.textDone, {color: theme.textColor}]}
        />
    );
});

const styles = ScaledSheet.create({
    textDone: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
});

export default TextDone;
