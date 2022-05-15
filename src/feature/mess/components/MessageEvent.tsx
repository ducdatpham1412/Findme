import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    creatorName: string;
    i18Content: string;
}

const MessageEvent = (props: Props) => {
    const {creatorName, i18Content} = props;
    const theme = Redux.getTheme();

    return (
        <StyleText
            originValue={`${creatorName} `}
            customStyle={[
                styles.textContainer,
                styles.textAll,
                {color: theme.holderColorLighter},
            ]}>
            <StyleText
                i18Text={i18Content}
                customStyle={[
                    styles.textAll,
                    {color: theme.holderColorLighter},
                ]}
            />
        </StyleText>
    );
};

const styles = ScaledSheet.create({
    textContainer: {
        alignSelf: 'center',
    },
    textAll: {
        fontSize: '14@ms',
    },
});

export default MessageEvent;
