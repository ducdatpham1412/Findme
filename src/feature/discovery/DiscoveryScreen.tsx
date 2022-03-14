import {TypeBubblePalace} from 'api/interface';
import {apiGetListBubbleActive} from 'api/module';
import {RELATIONSHIP, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {appAlert} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openPlusBox} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import BubblePushFrame from './components/BubblePushFrame';
import BubbleStatic from './components/BubbleStatic';
import PlusButton from './components/PlusButton';

const deleteHeight = moderateScale(70);
const maxNumberBubble = 4;

// This is bubble static

const DiscoveryScreen: React.FunctionComponent = () => {
    useNotification();

    const {setShowTabBar} = useTabBar();
    // const isFocused = useIsFocused();

    const theme = Redux.getTheme();
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const {imageBackground} = Redux.getResource();
    const isModeExp = Redux.getModeExp();

    // const scrollRef = useRef<ScrollView>(null);
    const [listBubbles, setListBubbles] = useState<
        Array<TypeBubblePalace | undefined>
    >([]);

    const [discoveryStaticSize, setDiscoveryStaticSize] = useState({
        width: 0,
        height: 0,
    });
    const [rectangleDelete, setRectangleDelete] = useState({
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
    });
    const translateY = useRef(new Animated.Value(-deleteHeight)).current;
    const deleteScale = useRef(new Animated.Value(1)).current;
    const [showRecDelete, setShowRecDelete] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    // const scrollToSuitable = () => {
    //     scrollRef.current?.scrollTo({
    //         y: Metrics.height,
    //         animated: true,
    //     });
    // };

    // useEffect(() => {
    //     if (isFocused) {
    //         setShowTabBar(true);
    //         scrollToSuitable();
    //     }
    // }, [isFocused]);

    const getListBubbleActive = useCallback(async () => {
        try {
            if (!isModeExp) {
                const res = await apiGetListBubbleActive();
                setListBubbles(res.data);
            }
        } catch (err) {
            appAlert(err);
        }
    }, [isModeExp]);

    const handleInsertNewBubble = useCallback(
        (_newBubble: any) => {
            const newBubble: TypeBubblePalace = _newBubble;
            setListBubbles((preValue: Array<TypeBubblePalace | undefined>) => {
                const isNewBubbleOfMe =
                    newBubble.relationship === RELATIONSHIP.self;

                // if new bubble is of me, set maximum of me = 2
                if (isNewBubbleOfMe) {
                    let numberMyBubblesBefore = 0;
                    preValue.forEach(item => {
                        if (item?.relationship === RELATIONSHIP.self) {
                            numberMyBubblesBefore++;
                        }
                    });

                    const temp = [...preValue];
                    let hadInsert = false;
                    if (numberMyBubblesBefore === 0) {
                        for (let i = 0; i < maxNumberBubble; i++) {
                            if (!temp[i] || temp[i]?.readyToReplace) {
                                temp[i] = newBubble;
                                hadInsert = true;
                                break;
                            }
                        }
                        if (!hadInsert) {
                            temp[0] = newBubble;
                        }
                    } else if (numberMyBubblesBefore === 1) {
                        for (let i = 0; i < maxNumberBubble; i++) {
                            if (!temp[i] && temp[i]?.readyToReplace) {
                                temp[i] = newBubble;
                                hadInsert = true;
                                break;
                            }
                        }
                        if (!hadInsert) {
                            let indexInsert = 0;
                            if (temp[0]?.relationship === RELATIONSHIP.self) {
                                indexInsert = 1;
                            }
                            temp[indexInsert] = newBubble;
                        }
                    } else if (numberMyBubblesBefore === 2) {
                        for (let i = 0; i < temp.length; i++) {
                            if (temp[i]?.relationship === RELATIONSHIP.self) {
                                temp[i] = newBubble;
                                break;
                            }
                        }
                    }
                    return temp;
                }

                /**
                 * Check bubble of other
                 */
                if (isModeExp && newBubble?.canNotInteract) {
                    // Is in enjoy and new bubble is of user have account
                    const checkHadBubbleOfUserHaveAccount = preValue.findIndex(
                        item => !!item?.canNotInteract,
                    );
                    if (checkHadBubbleOfUserHaveAccount >= 0) {
                        return preValue;
                    }
                }

                if (preValue.length === maxNumberBubble) {
                    let hadInsert = false;
                    const temp = preValue.map(item => {
                        if ((item && !item?.readyToReplace) || hadInsert) {
                            return item;
                        }
                        hadInsert = true;
                        return newBubble;
                    });
                    return temp;
                }
                return preValue.concat(newBubble);
            });
        },
        [isModeExp],
    );

    useEffect(() => {
        getListBubbleActive();
    }, [isModeExp]);

    useEffect(() => {
        // add new
        if (bubblePalaceAction.action === TYPE_BUBBLE_PALACE_ACTION.addNew) {
            handleInsertNewBubble(bubblePalaceAction.payload);
        }

        // remove one
        else if (
            bubblePalaceAction.action === TYPE_BUBBLE_PALACE_ACTION.removeOne
        ) {
            setListBubbles((preValue: Array<TypeBubblePalace | undefined>) => {
                return preValue.map(item => {
                    if (item?.id !== bubblePalaceAction.payload) {
                        return item;
                    }
                    return undefined;
                });
            });
        }

        // clear all
        else if (
            bubblePalaceAction.action === TYPE_BUBBLE_PALACE_ACTION.clearAll
        ) {
            setListBubbles([]);
        }

        // change to status ready to replace
        else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.readyToReplace
        ) {
            setListBubbles((preValue: Array<TypeBubblePalace | undefined>) => {
                return preValue.map(item => {
                    if (item?.id !== bubblePalaceAction.payload) {
                        return item;
                    }
                    if (item && item?.id === bubblePalaceAction.payload) {
                        return {
                            ...item,
                            readyToReplace: true,
                        };
                    }
                    return undefined;
                });
            });
        }
    }, [bubblePalaceAction, isModeExp]);

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: showRecDelete ? 0 : -deleteHeight,
            useNativeDriver: true,
        }).start();
    }, [showRecDelete]);

    useEffect(() => {
        Animated.spring(deleteScale, {
            toValue: canDelete ? 1.3 : 1,
            useNativeDriver: true,
        }).start();
    }, [canDelete]);

    /**
     * Render view
     */
    const RenderBackground = useMemo(() => {
        return (
            <View style={styles.backgroundView}>
                <StyleImage
                    source={{uri: imageBackground}}
                    customStyle={[
                        styles.imageBackground,
                        {tintColor: theme.backgroundButtonColor},
                    ]}
                />
            </View>
        );
    }, [theme]);

    const RenderDeleteBubble = useMemo(() => {
        return (
            <Animated.View
                style={[
                    styles.deleteBubbleView,
                    {
                        transform: [{translateY}, {scale: deleteScale}],
                        borderColor: canDelete
                            ? theme.highlightColor
                            : theme.borderColor,
                    },
                ]}
                onLayout={({nativeEvent}) =>
                    setRectangleDelete({
                        x1: nativeEvent.layout.x,
                        x2: nativeEvent.layout.x + 100,
                        y1: nativeEvent.layout.y,
                        y2: nativeEvent.layout.y + 100,
                    })
                }>
                <MaterialCommunityIcons
                    name="delete-outline"
                    style={[
                        styles.deleteIcon,
                        {
                            color: canDelete
                                ? theme.highlightColor
                                : theme.borderColor,
                        },
                    ]}
                />
            </Animated.View>
        );
    }, [canDelete]);

    const RenderBubblePlaceStatic = useMemo(() => {
        return (
            <View
                style={styles.bodyPalaceStatic}
                onLayout={event => {
                    setDiscoveryStaticSize({
                        width: event.nativeEvent.layout.width,
                        height: event.nativeEvent.layout.height,
                    });
                }}>
                {listBubbles.map((item, index) => {
                    if (!item) {
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.elementBubbleStatic,
                                    {
                                        width: discoveryStaticSize.width / 2,
                                        height: discoveryStaticSize.height / 2,
                                    },
                                ]}
                            />
                        );
                    }
                    return (
                        <View
                            key={item.id}
                            style={[
                                styles.elementBubbleStatic,
                                {
                                    width: discoveryStaticSize.width / 2,
                                    height: discoveryStaticSize.height / 2,
                                },
                            ]}>
                            <BubbleStatic
                                item={item}
                                rectangleDelete={rectangleDelete}
                                setShowRecDelete={setShowRecDelete}
                                setCanDelete={setCanDelete}
                            />
                        </View>
                    );
                })}
            </View>
        );
    }, [rectangleDelete, discoveryStaticSize, listBubbles]);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {/* Background image */}
            {RenderBackground}

            {/* BUBBLES PALACE */}

            {/* This is for animation fly from bottom to top */}
            {/* <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.discoveryPalace}
                onLayout={scrollToSuitable}>
                <View style={styles.standardView}>
                    {listBubbles.map(item => (
                        <Bubble key={item.id} item={item} />
                    ))}
                </View>
            </ScrollView> */}

            {/* This is for bubble only fly static */}
            <View style={styles.discoveryPalaceStatic}>
                {RenderDeleteBubble}
                {RenderBubblePlaceStatic}
            </View>

            {/* Bubble push frame */}
            <BubblePushFrame />

            {/* Heart - favorite chat => Develop later */}
            {/* <HeartButton onPress={() => openHeartBox(setShowTabBar)} /> */}

            <PlusButton onPress={() => openPlusBox(setShowTabBar)} />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    backgroundView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
    },
    searchButton: {
        position: 'absolute',
        left: '15@s',
        top: '5@vs',
    },
    // discovery palace
    discoveryPalace: {
        width: '100%',
        height: 2 * Metrics.height,
    },
    standardView: {
        width: Metrics.width,
        height: Metrics.height,
        position: 'absolute',
        bottom: 0,
    },
    discoveryPalaceStatic: {
        flex: 1,
        paddingBottom: '50@s',
    },
    bodyPalaceStatic: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    elementBubbleStatic: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    // delete bubble view
    deleteBubbleView: {
        position: 'absolute',
        width: deleteHeight,
        height: deleteHeight,
        alignSelf: 'center',
        borderWidth: '1@ms',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteIcon: {
        fontSize: '30@ms',
    },
});

export default DiscoveryScreen;
