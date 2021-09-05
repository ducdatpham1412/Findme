import {StyleIcon, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**
 * Two bubble:      x0 - x1 - x3 - x3
 * Circle middle:   p1 - p2
 * Container:       p0
 */

let x: any;

const BubblePushFrame = () => {
    const theme = Redux.getTheme();
    const isDisplayBubbleFrame = Redux.getDisplayBubbleFrame();
    const {listBubbles} = Redux.getResource();
    const indexBubble = Redux.getIndexBubble();

    const [isPinning, setIsPinning] = useState(false);
    /**
     * For moving frame when tab navigator
     */
    const aim = useRef(new Animated.Value(0)).current;
    const translateY = aim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const controlFrame = () => {
        Animated.timing(aim, {
            toValue: isDisplayBubbleFrame ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        if (isDisplayBubbleFrame) {
            x = setTimeout(() => {
                Redux.setDisplayBubbleFrame(false);
            }, 5000);
        }
    };

    useEffect(() => {
        clearTimeout(x);
        controlFrame();
    }, [isDisplayBubbleFrame]);

    /**
     * For pan response
     */
    const [tempIndex, setTempIndex] = useState(indexBubble);

    const [twoBubblesWidth, setTwoBubblesWidth] = useState(0);
    const [middleWidth, setMiddleWidth] = useState(0);
    const [d0, setD0] = useState(0);
    const [p0, setP0] = useState(0);

    const dMove = (twoBubblesWidth * 5) / 16;

    const d1 = (twoBubblesWidth * 3) / 8;
    const d2 = (twoBubblesWidth * 2) / 8;
    const d3 = (twoBubblesWidth * 3) / 8;

    const p1 = p0 + d0;
    const p2 = p1 + middleWidth;

    const pan = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gesture) => {
                // console.log(evt.nativeEvent);
                pan.setValue(gesture.dx);
            },
        }),
    ).current;

    useEffect(() => {
        const newPan = indexBubble === 0 ? dMove : -dMove;
        Animated.spring(pan, {
            toValue: newPan,
            useNativeDriver: false,
        }).start();
    }, [indexBubble, twoBubblesWidth]);

    // press icon pinning / cancel
    const onPressIcon = () => {
        if (!isPinning) {
            clearTimeout(x);
            setIsPinning(true);
        } else {
            Redux.setDisplayBubbleFrame(false);
            setIsPinning(false);
        }
    };

    // press bubble
    const onPressBubble = (index: number) => {
        if (index === 0) {
            Redux.setIndexBubble(0);
        } else if (index === 1) {
            Redux.setIndexBubble(1);
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{translateY}],
                    opacity: aim,
                },
            ]}
            onLayout={({nativeEvent}) => {
                setP0(nativeEvent.layout.x);
            }}>
            <View
                style={[styles.spaceBg, {backgroundColor: theme.tabBarColor}]}
            />

            <View
                style={[
                    styles.circleMiddle,
                    {borderColor: theme.highlightColor},
                ]}
                onLayout={({nativeEvent}) => {
                    setD0(nativeEvent.layout.x);
                    setMiddleWidth(nativeEvent.layout.width);
                }}
            />

            <Animated.View
                style={[
                    styles.twoBubbleView,
                    {
                        transform: [
                            {
                                translateX: pan,
                            },
                        ],
                    },
                ]}
                {...panResponder.panHandlers}
                onTouchMove={evt => {
                    const x0 =
                        evt.nativeEvent.pageX - evt.nativeEvent.locationX;
                    const x1 = x0 + d1;
                    const x2 = x1 + d2;
                    const x3 = x2 + d3;
                    const isOne =
                        (p1 > x0 && p1 < x1) || (p2 > x0 && p2 < x1) || p2 < x0;
                    const isTwo =
                        (p1 > x2 && p1 < x3) || (p2 > x2 && p2 < x3) || p1 > x3;
                    // console.log(isOne, ' - ', isTwo);
                    if (isOne && isTwo) {
                        return;
                    }
                    if (isOne) {
                        setTempIndex(0);
                    } else if (isTwo && listBubbles.length === 2) {
                        setTempIndex(1);
                    }
                }}
                onResponderRelease={() => {
                    Redux.setIndexBubble(tempIndex);
                    const newPan = indexBubble === 0 ? dMove : -dMove;
                    Animated.spring(pan, {
                        toValue: newPan,
                        useNativeDriver: false,
                    }).start();
                }}
                onLayout={({nativeEvent}) => {
                    setTwoBubblesWidth(nativeEvent.layout.width);
                }}>
                {!!listBubbles[0] && (
                    <View
                        style={[
                            styles.bubbleBox,
                            {
                                // backgroundColor: theme.backgroundColor,
                            },
                        ]}>
                        <StyleTouchable onPress={() => onPressBubble(0)}>
                            <StyleIcon
                                source={{uri: listBubbles[0].icon}}
                                size={25}
                                customStyle={{borderRadius: 100}}
                            />
                        </StyleTouchable>
                    </View>
                )}

                {!!listBubbles[1] && (
                    <View
                        style={[
                            styles.bubbleBox,
                            {
                                // backgroundColor: theme.borderColor,
                            },
                        ]}>
                        <StyleTouchable onPress={() => onPressBubble(1)}>
                            <StyleIcon
                                source={{uri: listBubbles[1].icon}}
                                size={25}
                                customStyle={{borderRadius: 100}}
                            />
                        </StyleTouchable>
                    </View>
                )}

                {/* <View
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }}
                /> */}
            </Animated.View>

            <StyleTouchable
                onPress={onPressIcon}
                customStyle={styles.iconTouch}>
                {isPinning ? (
                    <AntDesign
                        name="down"
                        style={[styles.iconAction, {color: theme.borderColor}]}
                    />
                ) : (
                    <AntDesign
                        name="pushpino"
                        style={[styles.iconAction, {color: theme.borderColor}]}
                    />
                )}
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        bottom: '70@vs',
        width: '160@s',
        height: '40@s',
        borderRadius: '100@s',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spaceBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: '30@vs',
        opacity: 0.6,
    },
    iconTouch: {
        position: 'absolute',
        left: '-20@s',
    },
    iconAction: {
        fontSize: '17@ms',
    },
    // circle middle
    circleMiddle: {
        width: '35@s',
        height: '35@s',
        borderRadius: '20@s',
        borderWidth: 2,
        position: 'absolute',
    },
    // bubbles
    twoBubbleView: {
        position: 'absolute',
        width: '80@s',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    bubbleBox: {
        width: '30@s',
        height: '30@s',
        borderRadius: '20@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BubblePushFrame;
