import Theme from 'asset/theme/Theme';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    NativeSyntheticEvent,
    ScrollView,
    StyleProp,
    TextLayoutEventData,
    TextStyle,
    View,
} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {StyleText, StyleTouchable} from './base';

interface Props {
    value: any;
    maxHeight?: number | string;
    textStyle?: StyleProp<TextStyle>;
}

const MAX_ROWS = 3;

const StyleMoreText = (props: Props) => {
    const {value, maxHeight = verticalScale(400), textStyle} = props;

    const [saveNumber, setSaveNumber] = useState(0);
    const [numberOfLines, setNumberOfLines] = useState<number | undefined>(
        undefined,
    );
    const displayButton = !!saveNumber && saveNumber > MAX_ROWS;
    const isShowMore = displayButton && numberOfLines === MAX_ROWS;

    const onTextLayOut = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            if (numberOfLines === undefined) {
                setSaveNumber(e.nativeEvent.lines.length);
                if (e.nativeEvent.lines.length > MAX_ROWS) {
                    setNumberOfLines(MAX_ROWS);
                }
            }
        },
        [numberOfLines],
    );

    useEffect(() => {
        setNumberOfLines(undefined);
    }, [value]);

    const RenderButtonShowMoreOrLess = useMemo(() => {
        const text = isShowMore ? 'common.seeMore' : 'common.seeLess';

        const onPress = () => {
            if (isShowMore) {
                setNumberOfLines(saveNumber);
            } else {
                setNumberOfLines(MAX_ROWS);
            }
        };

        return (
            <StyleTouchable onPress={onPress}>
                <StyleText
                    i18Text={text}
                    customStyle={styles.textSeeMoreOrLess}
                />
            </StyleTouchable>
        );
    }, [isShowMore, numberOfLines, saveNumber]);

    const styleScroll = displayButton ? (isShowMore ? {} : {maxHeight}) : {};

    return (
        <View style={[styles.container, styleScroll]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled>
                <StyleText
                    originValue={value}
                    customStyle={textStyle}
                    onTextLayout={onTextLayOut}
                    numberOfLines={isShowMore ? MAX_ROWS : numberOfLines}
                />
            </ScrollView>

            {displayButton && RenderButtonShowMoreOrLess}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
    },
    textSeeMoreOrLess: {
        fontSize: '14@ms',
        color: Theme.common.textMe,
        fontWeight: 'bold',
        marginTop: '10@vs',
        fontStyle: 'italic',
    },
});

export default StyleMoreText;
