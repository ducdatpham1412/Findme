import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

interface TextDoneProps {
    title?: string;
}

const TextDone = (props: TextDoneProps) => {
    const theme = Redux.getTheme();
    const {title = 'common.done'} = props;
    return (
        <StyleText
            i18Text={title}
            customStyle={[styles.textDone, {color: theme.textColor}]}
        />
    );
};

const styles = ScaledSheet.create({
    textDone: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
});

export default TextDone;
