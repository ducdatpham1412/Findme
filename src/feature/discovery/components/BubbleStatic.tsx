import {TypeBubblePalace} from 'api/interface';
import {RELATIONSHIP, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {TIMING_BUBBLE_FLY} from 'asset/standardValue';
import {StyleImage, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, PanResponder, View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import Svg, {Path} from 'react-native-svg';
import {interactBubble, onGoToSignUp} from 'utility/assistant';

interface BubbleProps {
    item: TypeBubblePalace;
    rectangleDelete: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
    setShowRecDelete: Function;
    setCanDelete: Function;
}

/**
 * Rectangle delete:
 *   x1 ----x2    y1
 *                |
 *                y2
 */

const {safeTopPadding, safeLeftPadding} = Metrics;
// create animated text

const BubbleStatic = (props: BubbleProps) => {
    const {item, rectangleDelete, setShowRecDelete, setCanDelete} = props;
    const {t} = useTranslation();
    const theme = Redux.getTheme();

    const [flagSize, setFlagSize] = useState({
        width: 0,
        height: 0,
    });

    const {icon, description, name} = item;
    const isMyBubble = item.relationship === RELATIONSHIP.self;

    const dPath = `M0 3 L${flagSize.width} 3 L${flagSize.width - 10} ${
        flagSize.height / 2
    } L${flagSize.width} ${flagSize.height - 3} L0 ${flagSize.height - 3} L10 ${
        flagSize.height / 2
    } L0 3`;

    const opacity = item?.canNotInteract ? 0.6 : 1;
    // const opacityBubble = useMemo(() => {
    //     if (item?.canNotInteract) {
    //         return 0.6;
    //     }
    //     if (isMyBubble) {
    //         return 1;
    //     }
    //     return 1;
    // }, [item.canNotInteract, isMyBubble]);

    /**
     * For moving bubble
     */
    const pan = useRef(new Animated.ValueXY()).current;
    const aimScale = useRef(new Animated.Value(1)).current;

    const onCheckImpactDelete = useCallback((x: number, y: number) => {
        const checkX = x > rectangleDelete.x1 && x < rectangleDelete.x2;
        const checkY = y > rectangleDelete.y1 && y < rectangleDelete.y2;
        return checkX && checkY;
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Animated.spring(aimScale, {
                    toValue: 1.5,
                    useNativeDriver: true,
                }).start();
                setShowRecDelete(true);
            },
            onPanResponderMove: (evt, gesture) => {
                const check = onCheckImpactDelete(
                    evt.nativeEvent.pageX - safeLeftPadding,
                    evt.nativeEvent.pageY - safeTopPadding,
                );
                if (check) {
                    setCanDelete(true);
                } else {
                    setCanDelete(false);
                }
                pan.setValue({
                    x: gesture.dx,
                    y: gesture.dy,
                });
            },
            onPanResponderRelease: evt => {
                const check = onCheckImpactDelete(
                    evt.nativeEvent.pageX - safeLeftPadding,
                    evt.nativeEvent.pageY - safeTopPadding,
                );
                // if check, delete this bubble
                if (check) {
                    Redux.setBubblePalaceAction({
                        action: TYPE_BUBBLE_PALACE_ACTION.removeOne,
                        payload: item.id,
                    });
                    setShowRecDelete(false);
                    setCanDelete(false);
                }
                // else bubble comeback old position
                else {
                    setShowRecDelete(false);
                    setCanDelete(false);
                    Animated.spring(pan, {
                        toValue: {x: 0, y: 0},
                        useNativeDriver: true,
                    }).start();
                    Animated.spring(aimScale, {
                        toValue: 1,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;

    useEffect(() => {
        const check = setTimeout(() => {
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.readyToReplace,
                payload: item.id,
            });
        }, TIMING_BUBBLE_FLY);
        return () => clearTimeout(check);
    }, []);

    const onInteractBubble = () => {
        if (item?.canNotInteract) {
            appAlert(t('discovery.interactBubble.thisIsUserHadAccount'), {
                moreNotice: 'profile.component.infoProfile.tellSignUp',
                moreAction: onGoToSignUp,
            });
        } else {
            interactBubble({
                itemBubble: item,
                isBubble: true,
                havingOption: true,
            });
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {translateY: pan.y},
                        {translateX: pan.x},
                        {scale: aimScale},
                    ],
                    opacity,
                },
            ]}>
            {/* Bubble */}
            <View
                style={[
                    styles.avatarBox,
                    {
                        borderColor: isMyBubble
                            ? theme.highlightColor
                            : theme.textColor,
                    },
                ]}>
                <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={styles.avatarCreator}
                />
                <Animated.Text
                    style={styles.spaceAnimatedText}
                    onPress={onInteractBubble}
                    {...panResponder.panHandlers}
                />
            </View>

            {/* Cord */}
            <View
                style={[
                    styles.chainLink,
                    {
                        borderColor: isMyBubble
                            ? theme.highlightColor
                            : theme.borderColor,
                    },
                ]}
            />

            {/* Description */}
            <View
                style={styles.descriptionBox}
                onLayout={({nativeEvent}) =>
                    setFlagSize({
                        width: nativeEvent.layout.width,
                        height: nativeEvent.layout.height,
                    })
                }
                // onPress={onInteractBubble}
            >
                <Svg width={'100%'} height={'100%'} style={styles.svgView}>
                    <Path
                        d={dPath}
                        stroke={
                            isMyBubble
                                ? theme.highlightColor
                                : theme.borderColor
                        }
                        strokeWidth={scale(0.5)}
                        fill="none"
                    />
                </Svg>

                <View style={styles.headerView}>
                    <StyleImage
                        source={{uri: icon}}
                        customStyle={styles.iconHobby}
                    />
                    <StyleText
                        originValue={name}
                        customStyle={[
                            styles.textName,
                            {color: theme.textColor},
                        ]}
                        numberOfLines={1}
                    />
                </View>

                <View style={styles.contentBox}>
                    <StyleText
                        originValue={description}
                        customStyle={[styles.text, {color: theme.textColor}]}
                    />
                </View>

                <Animated.Text
                    style={styles.spaceAnimatedText}
                    {...panResponder.panHandlers}
                    onPress={onInteractBubble}
                />
            </View>
        </Animated.View>
    );
};

const bubbleWidth = Metrics.width / 3.2;

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
        width: bubbleWidth,
    },
    avatarBox: {
        width: '37@s',
        height: '37@s',
        borderRadius: '20@s',
        borderWidth: '1.5@ms',
    },
    chainLink: {
        borderWidth: '0.5@s',
        height: '20@vs',
    },
    avatarCreator: {
        width: '100%',
        height: '100%',
        borderRadius: '20@s',
    },
    spaceAnimatedText: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    // path
    descriptionBox: {
        width: bubbleWidth,
    },
    svgView: {
        position: 'absolute',
    },
    // header
    headerView: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: '15@s',
        paddingRight: '30@s',
        paddingTop: '10@vs',
        alignItems: 'center',
        overflow: 'hidden',
    },
    iconHobby: {
        width: '17@s',
        height: '17@s',
        borderRadius: '10@s',
        marginRight: '7@s',
    },
    textName: {
        fontSize: '10@ms',
        fontWeight: 'bold',
    },
    // content
    contentBox: {
        width: '100%',
        paddingHorizontal: '15@s',
        paddingVertical: '10@vs',
    },
    text: {
        fontSize: '9@ms',
    },
});

export default memo(BubbleStatic, (prevProps: BubbleProps, nextProps: any) => {
    Object.entries(prevProps.item).forEach(item => {
        const [key, value] = item;
        if (nextProps.item?.[key] !== value) {
            return false;
        }
    });
    for (const [key, value] of Object.entries(prevProps.rectangleDelete)) {
        if (nextProps.rectangleDelete[key] !== value) {
            return false;
        }
    }
    return true;
});
