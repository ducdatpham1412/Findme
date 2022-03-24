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
    maxRows?: number;
    textStyle?: StyleProp<TextStyle>;
    onPress?(): void;
}

const StyleMoreText = (props: Props) => {
    const {
        value,
        maxHeight = verticalScale(400),
        maxRows = 8,
        textStyle,
        onPress,
    } = props;

    const [saveNumber, setSaveNumber] = useState(0);
    const [numberOfLines, setNumberOfLines] = useState<number | undefined>(
        undefined,
    );
    const displayButton = !!saveNumber && saveNumber > maxRows;
    const isShowMore = displayButton && numberOfLines === maxRows;

    const onTextLayOut = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            if (numberOfLines === undefined) {
                setSaveNumber(e.nativeEvent.lines.length);
                if (e.nativeEvent.lines.length > maxRows) {
                    setNumberOfLines(maxRows);
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

        const onPressText = () => {
            if (isShowMore) {
                setNumberOfLines(saveNumber);
            } else {
                setNumberOfLines(maxRows);
            }
        };

        return (
            <StyleTouchable onPress={onPressText}>
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
                    numberOfLines={isShowMore ? maxRows : numberOfLines}
                    onPress={onPress}
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
