import {DELAY_LONG_PRESS} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {pushBubble} from 'hook/useSocketIO';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Platform, View} from 'react-native';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {openPlusBox} from 'utility/assistant';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

/**
 * Button circle in the middle
 * 1. Show iconPlus if not have any bubble
 * 2. Show indexBubble of listBubbles
 * 3. Disable when open BubblePushFrame
 */
const ratio = scale(50) / scale(40);

const TabNavigator = (props?: any) => {
    const isModeExp = Redux.getModeExp();
    const theme = Redux.getTheme();
    const {listBubbles, profile} = Redux.getPassport();
    const indexBubble = Redux.getIndexBubble();
    const isDisplayBubbleFrame = Redux.getDisplayBubbleFrame();

    const numberNewMessages = Redux.getNumberNewMessages();

    const routeDiscovery = props.state.routes[0];
    const routeMessage = props.state.routes[1];
    const routeProfile = props.state.routes[2];
    const routeNotification = props.state.routes[3];

    const isFocusingDiscovery = props.state.index === 0;
    const isFocusingMess = props.state.index === 1;
    const isFocusingProfile = props.state.index === 2;
    const isFocusingNotification = props.state.index === 3;

    const {showTabBar, setShowTabBar} = useTabBar();

    const aim = useRef(new Animated.Value(0)).current;
    const [buttonPushHeight, setButtonPushHeight] = useState(scale(50));
    const [height, setHeight] = useState(scale(40));
    aim.addListener(({value}) => {
        setHeight(value);
        setButtonPushHeight(ratio * value);
    });

    const translateYButtonPush = useRef(new Animated.Value(0)).current;

    const controlTabBar = () => {
        if (!showTabBar) {
            Animated.timing(aim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(aim, {
                toValue: scale(40),
                duration: 120,
                useNativeDriver: true,
            }).start();
        }
    };

    useEffect(() => {
        controlTabBar();
    }, [showTabBar]);

    useEffect(() => {
        if (isFocusingDiscovery) {
            Animated.timing(translateYButtonPush, {
                toValue: scale(-25),
                duration: 400,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateYButtonPush, {
                toValue: scale(-5),
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [isFocusingDiscovery]);

    const onOpenBubblePushFrame = () => {
        if (isFocusingDiscovery) {
            Redux.setDisplayBubbleFrame(true);
        }
    };
    const onPushBubblePalace = () => {
        if (isFocusingDiscovery) {
            if (listBubbles.length) {
                try {
                    if (!isModeExp) {
                        pushBubble({
                            myId: profile.id,
                            bubble: listBubbles[indexBubble],
                        });
                    } else {
                        pushBubble({
                            myId: profile.id,
                            bubble: listBubbles[indexBubble],
                        });
                    }
                } catch (err) {
                    appAlert(err);
                }
            } else {
                openPlusBox(setShowTabBar);
            }
        }
    };

    /**
     * Render view
     */
    const RenderBackground = useMemo(() => {
        return (
            <View
                style={[
                    styles.spaceBackground,
                    {
                        borderColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}
            />
        );
    }, [theme]);

    const RenderDiscoveryButton = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => {
                    navigate(routeDiscovery.name);
                }}>
                <Entypo
                    name="compass"
                    style={{
                        opacity: isFocusingDiscovery ? 1 : 0.4,
                        fontSize: moderateScale(20),
                        color: theme.tabBarIconColor,
                    }}
                />
            </StyleTouchable>
        );
    }, [isFocusingDiscovery, theme]);

    const RenderMessageButton = useMemo(() => {
        const tintColor =
            numberNewMessages > 0
                ? theme.highlightColor
                : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(routeMessage.name)}>
                <View>
                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        style={{
                            opacity: isFocusingMess ? 1 : 0.4,
                            color: tintColor,
                            fontSize: moderateScale(20),
                        }}
                    />
                    {numberNewMessages > 0 && (
                        <View style={styles.newMessagesBox}>
                            <StyleText
                                originValue={numberNewMessages}
                                customStyle={styles.textNewMessages}
                            />
                        </View>
                    )}
                </View>
            </StyleTouchable>
        );
    }, [isFocusingMess, numberNewMessages, theme]);

    const RenderProfileButton = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => {
                    if (isFocusingProfile) {
                        // navigate(routeProfile.name, {
                        //     screen: PROFILE_ROUTE.profileScreen,
                        //     resetToMyProfile: 'reset',
                        // });
                        navigate(PROFILE_ROUTE.myProfile);
                    } else {
                        navigate(routeProfile.name);
                    }
                }}>
                <Feather
                    name="user"
                    style={{
                        fontSize: moderateScale(20),
                        color: theme.textHightLight,
                        opacity: isFocusingProfile ? 1 : 0.6,
                    }}
                />
            </StyleTouchable>
        );
    }, [isFocusingProfile, theme]);

    const RenderNotificationButton = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(routeNotification.name)}>
                <SimpleLineIcons
                    name="book-open"
                    style={{
                        fontSize: moderateScale(18),
                        color: theme.tabBarIconColor,
                        opacity: isFocusingNotification ? 1 : 0.4,
                    }}
                />
            </StyleTouchable>
        );
    }, [isFocusingNotification, theme]);

    return (
        <>
            <Animated.View
                style={[
                    styles.container,
                    {
                        height,
                    },
                ]}>
                {RenderBackground}

                {RenderDiscoveryButton}

                {RenderMessageButton}

                {/* Push button */}
                <View style={styles.buttonView} />

                {RenderProfileButton}

                {RenderNotificationButton}
            </Animated.View>

            <Animated.View
                style={[
                    styles.bubbleView,
                    {transform: [{translateY: translateYButtonPush}]},
                ]}>
                <StyleTouchable
                    customStyle={[
                        styles.buttonPush,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                            height: buttonPushHeight,
                        },
                    ]}
                    onLongPress={onOpenBubblePushFrame}
                    onDoublePress={onOpenBubblePushFrame}
                    delayLongPress={DELAY_LONG_PRESS}
                    onPress={onPushBubblePalace}
                    disableOpacity={1}
                    disable={isDisplayBubbleFrame || !isFocusingDiscovery}>
                    {listBubbles.length ? (
                        <StyleImage
                            source={{
                                uri: listBubbles[indexBubble].icon,
                            }}
                            customStyle={styles.indexBubbleNow}
                        />
                    ) : (
                        <MaterialIcons
                            name="bubble-chart"
                            size={moderateScale(26)}
                            color={theme.tabBarIconColor}
                        />
                    )}
                </StyleTouchable>
            </Animated.View>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        width: '100%',
        height: '40@s',
        flexDirection: 'row',
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.45,
        borderTopWidth: Platform.select({
            ios: 0.5,
            android: 0.5,
        }),
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBox: {
        position: 'absolute',
        width: '3@s',
        height: '3@s',
        bottom: '-6@s',
        borderRadius: '3@s',
        opacity: 0.6,
    },
    buttonPush: {
        width: '50@s',
        borderRadius: '50@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    indexBubbleNow: {
        borderRadius: '100@s',
        width: '25@s',
        height: '25@s',
    },
    newMessagesBox: {
        position: 'absolute',
        width: '13@ms',
        height: '13@ms',
        backgroundColor: 'red',
        right: '-7@ms',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNewMessages: {
        fontSize: '7@ms',
        color: 'white',
    },
    bubbleView: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 2,
        bottom: 0,
    },
});

export default TabNavigator;
