/* eslint-disable no-underscore-dangle */
import {StyleImage} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    GestureResponderEvent,
    I18nManager,
    Image,
    PanResponder,
    PanResponderGestureState,
    StyleProp,
    ViewStyle,
} from 'react-native';
import {
    DEAD_ZONE,
    DefaultTransitionSpec,
    isMovingHorizontally,
    swipeVelocityThreshold,
    useAnimatedValue,
} from 'utility/animation';

interface Props {
    images: Array<string>;
    syncWidth: number;
    containerStyle?: StyleProp<ViewStyle>;
    onDoublePress?(): void;
    index?: number;
    onChangeIndex?(value: number): void;
}

const ScrollSyncSizeImage = (props: Props) => {
    const {
        images,
        syncWidth,
        containerStyle,
        onDoublePress,
        index,
        onChangeIndex,
    } = props;

    const currentIndexRef = useRef(0);

    const [ratio, setRatio] = useState(0);

    const height = ratio * syncWidth;
    const numberTabs = images.length;
    const layOutWidth = syncWidth * numberTabs;
    const maxTranslate = layOutWidth * (numberTabs - 1);
    const swipeDistanceThreshold = syncWidth / 1.75;

    const panX = useAnimatedValue(0);
    const translateX = Animated.multiply(
        panX.interpolate({
            inputRange: [-maxTranslate, 0],
            outputRange: [-maxTranslate, 0],
            extrapolate: 'clamp',
        }),
        I18nManager.isRTL ? -1 : 1,
    );

    const jumpToIndex = (__index: number) => {
        onChangeIndex?.(__index);
        const offset = -__index * syncWidth;
        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
            timing(panX, {
                ...transitionConfig,
                toValue: offset,
                useNativeDriver: false,
            }),
        ]).start(({finished}) => {
            if (finished) {
                currentIndexRef.current = __index;
            }
        });
    };

    // Check can moving
    const canMoveScreen = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
        const check =
            isMovingHorizontally(event, gestureState) &&
            ((diffX >= DEAD_ZONE && currentIndexRef.current > 0) ||
                (diffX <= -DEAD_ZONE &&
                    currentIndexRef.current < numberTabs - 1));
        return check;
    };

    // Start grant move
    const startGesture = () => {
        panX.stopAnimation();
        const temp: any = panX;
        panX.setOffset(temp._value);
    };

    // Moving
    const respondToGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;

        if (
            (diffX > 0 && currentIndexRef.current <= 0) ||
            (diffX < 0 && currentIndexRef.current >= numberTabs - 1)
        ) {
            return;
        }

        panX.setValue(diffX);
    };

    // Finish
    const finishGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        panX.flattenOffset();

        const currentIndex = currentIndexRef.current;
        let nextIndex = currentIndexRef.current;

        if (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
            (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
                Math.abs(gestureState.vx) > swipeVelocityThreshold)
        ) {
            nextIndex = Math.round(
                Math.min(
                    Math.max(
                        0,
                        I18nManager.isRTL
                            ? currentIndex +
                                  gestureState.dx / Math.abs(gestureState.dx)
                            : currentIndex -
                                  gestureState.dx / Math.abs(gestureState.dx),
                    ),
                    numberTabs - 1,
                ),
            );

            currentIndexRef.current = nextIndex;
        }

        if (!Number.isFinite(nextIndex)) {
            nextIndex = currentIndex;
        }

        jumpToIndex(nextIndex);
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: canMoveScreen,
        onMoveShouldSetPanResponderCapture: canMoveScreen,
        onPanResponderGrant: startGesture,
        onPanResponderMove: respondToGesture,
        onPanResponderTerminate: finishGesture,
        onPanResponderRelease: finishGesture,
        onPanResponderTerminationRequest: () => true,
    });

    useEffect(() => {
        if (images[0]) {
            Image.getSize(images[0], (w, h) => {
                setRatio(h / w);
            });
        }
    }, [images[0]]);

    useEffect(() => {
        if (index !== undefined) {
            jumpToIndex(index);
        }
    }, [index]);

    return (
        <StyleTouchHaveDouble
            customStyle={[
                containerStyle,
                {
                    width: syncWidth,
                },
            ]}
            onDoubleClick={onDoublePress}>
            <Animated.View
                style={{
                    width: layOutWidth,
                    flexDirection: 'row',
                    transform: [{translateX}],
                }}
                {...panResponder.panHandlers}>
                {images.map(url => (
                    <StyleImage
                        key={url}
                        source={{uri: url}}
                        customStyle={{
                            width: syncWidth,
                            height,
                        }}
                    />
                ))}
            </Animated.View>
        </StyleTouchHaveDouble>
    );
};

export default ScrollSyncSizeImage;