/* eslint-disable no-underscore-dangle */
import {Metrics} from 'asset/metrics';
import React, {Children, ReactNode, useEffect, useRef} from 'react';
import {
    Animated,
    GestureResponderEvent,
    I18nManager,
    PanResponder,
    PanResponderGestureState,
    StyleSheet,
} from 'react-native';
import {
    DEAD_ZONE,
    DefaultTransitionSpec,
    isMovingHorizontally,
    swipeVelocityThreshold,
    useAnimatedValue,
} from 'utility/animation';

interface Props {
    onChangeTabBarProps?(e: any): void;
    children: ReactNode;
    index: number;
    onChangeIndex(value: number): void;
    listCallbackWhenFocus: Array<Function>;
}

const screenWidth = Metrics.width;
const swipeDistanceThreshold = screenWidth / 1.75;

const StyleTabView = (props: Props) => {
    const {children, index = 0, onChangeIndex, listCallbackWhenFocus} = props;
    const numberTabs = Children.toArray(children).length;
    const layOutWidth = screenWidth * numberTabs;
    const maxTranslate = layOutWidth * (numberTabs - 1);

    const currentIndexRef = useRef(0);
    const listCheckLazy = useRef<Array<boolean>>([]);

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
        const offset = -__index * screenWidth;
        onChangeIndex?.(__index);

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
                if (listCheckLazy.current[__index] === false) {
                    listCallbackWhenFocus?.[__index]?.();
                    listCheckLazy.current[__index] = true;
                }
            }
        });
    };

    useEffect(() => {
        if (index !== currentIndexRef.current) {
            jumpToIndex(index);
        }
    }, [index]);

    useEffect(() => {
        const temp: Array<boolean> = [];
        for (let i = 0; i < numberTabs; i++) {
            temp.push(false);
        }
        listCheckLazy.current = temp;
    }, []);

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

    return (
        <Animated.View
            style={[
                styles.container,
                {width: layOutWidth, transform: [{translateX}]},
            ]}
            {...panResponder.panHandlers}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});

export default StyleTabView;
