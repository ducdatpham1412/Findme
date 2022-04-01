import Images from 'asset/img/images';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Platform, View} from 'react-native';
import {
    moderateScale,
    scale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ratio = scale(40) / scale(40);
const opacityNotFocus = 0.6;

const TabNavigator = (props?: any) => {
    const theme = Redux.getTheme();

    const numberNewMessages = Redux.getNumberNewMessages();
    const {avatar} = Redux.getPassport().profile;

    const routeDiscovery = props.state.routes[0];
    const routeMessage = props.state.routes[1];
    const routeProfile = props.state.routes[2];
    const routeNotification = props.state.routes[3];

    const isFocusingDiscovery = props.state.index === 0;
    const isFocusingMess = props.state.index === 1;
    const isFocusingProfile = props.state.index === 2;
    const isFocusingNotification = props.state.index === 3;

    const {showTabBar} = useTabBar();

    const aim = useRef(new Animated.Value(0)).current;
    const [buttonPushHeight, setButtonPushHeight] = useState(scale(40));
    const [height, setHeight] = useState(scale(40));
    aim.addListener(({value}) => {
        setHeight(value);
        setButtonPushHeight(ratio * value);
    });

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

    const onGoToCreatePost = useCallback(() => {
        navigate(MAIN_SCREEN.profileRoute, {
            screen: PROFILE_ROUTE.createPostPreview,
        });
    }, []);

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
                        opacity: isFocusingDiscovery ? 1 : opacityNotFocus,
                        fontSize: moderateScale(20),
                        color: theme.textHightLight,
                    }}
                />
            </StyleTouchable>
        );
    }, [isFocusingDiscovery, theme]);

    const RenderMessageButton = useMemo(() => {
        const tintColor =
            numberNewMessages > 0 ? theme.highlightColor : theme.textHightLight;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(routeMessage.name)}>
                <View>
                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        style={{
                            opacity: isFocusingMess ? 1 : opacityNotFocus,
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
                        navigate(MAIN_SCREEN.profileRoute, {
                            screen: PROFILE_ROUTE.myProfile,
                        });
                    } else {
                        navigate(routeProfile.name);
                    }
                }}>
                <Feather
                    name="user"
                    style={{
                        fontSize: moderateScale(20),
                        color: theme.textHightLight,
                        opacity: isFocusingProfile ? 1 : opacityNotFocus,
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
                <MaterialIcons
                    name="notifications-none"
                    style={{
                        fontSize: moderateScale(24),
                        color: theme.textHightLight,
                        opacity: isFocusingNotification ? 1 : opacityNotFocus,
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

                {RenderNotificationButton}

                {RenderProfileButton}
            </Animated.View>

            <Animated.View
                style={[
                    styles.bubbleView,
                    {transform: [{translateY: -verticalScale(4)}]},
                ]}>
                <StyleTouchable
                    customStyle={[
                        styles.buttonPush,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                            height: buttonPushHeight,
                        },
                    ]}
                    onPress={onGoToCreatePost}>
                    <StyleImage
                        source={{uri: avatar}}
                        customStyle={styles.avatar}
                    />
                    <StyleImage
                        source={Images.icons.zoomPhoto}
                        customStyle={[
                            styles.zoomPhoto,
                            {tintColor: theme.borderColor},
                        ]}
                    />
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
        opacity: 0.25,
        borderTopWidth: Platform.select({
            ios: '1.5@ms',
            android: '1.5@ms',
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
    buttonPush: {
        width: '40@s',
        borderRadius: '40@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '45%',
        height: '45%',
        borderRadius: '30@s',
    },
    zoomPhoto: {
        position: 'absolute',
        width: '60%',
        height: '60%',
    },
});

export default TabNavigator;
