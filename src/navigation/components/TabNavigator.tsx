import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

// const AnimatedLinear = Animated.createAnimatedComponent(LinearGradient);

const TabNavigator = (props: any) => {
    const theme = Redux.getTheme();

    const numberNewMessages = Redux.getNumberNewMessages();
    const numberNewNotifications = Redux.getNumberNewNotifications();
    const {avatar} = Redux.getPassport().profile;

    const {showTabBar} = useTabBar();

    // for animation all tab bar
    const aim = useRef(new Animated.Value(0)).current;
    const [height, setHeight] = useState(moderateScale(50));
    aim.addListener(({value}) => {
        setHeight(value);
    });

    // for indicator
    const tabIndexFocus = props.state.index;
    const [indicatorWidth, setIndicatorWidth] = useState(0);
    const indicatorTranslateX = useRef(new Animated.Value(0)).current;
    const indicatorTranslateY = useRef(new Animated.Value(0)).current;

    // for add more view
    // const addMoreWidth = useRef(new Animated.Value(0)).current;

    const controlTabBar = () => {
        if (!showTabBar) {
            Animated.timing(aim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(aim, {
                toValue: moderateScale(50),
                duration: 120,
                useNativeDriver: true,
            }).start();
        }
    };

    useEffect(() => {
        controlTabBar();
    }, [showTabBar]);

    useEffect(() => {
        if (tabIndexFocus === 0 || tabIndexFocus === 1) {
            // Animated.timing(addMoreWidth, {
            //     toValue: 0,
            //     useNativeDriver: false,
            //     duration: 600,
            // }).start();
            Animated.spring(indicatorTranslateX, {
                toValue: indicatorWidth * tabIndexFocus,
                useNativeDriver: true,
            }).start();
            Animated.spring(indicatorTranslateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(indicatorTranslateY, {
                toValue: moderateScale(-50),
                useNativeDriver: true,
            }).start();
            // Animated.spring(addMoreWidth, {
            //     toValue: Metrics.width,
            //     useNativeDriver: false,
            // }).start();
        }
    }, [tabIndexFocus]);

    const onGoToCreatePost = () => {
        navigate(PROFILE_ROUTE.createPostPreview);
    };

    const onGoToCreateGroup = () => {
        navigate(PROFILE_ROUTE.createGroup);
    };

    /**
     * Render view
     */
    const RenderDiscoveryButton = () => {
        const tintColor =
            tabIndexFocus === 0 ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => {
                    navigate(MAIN_SCREEN.discoveryRoute);
                }}
                onLayout={e => {
                    if (!indicatorWidth) {
                        setIndicatorWidth(e.nativeEvent.layout.width);
                    }
                }}>
                <StyleImage
                    source={Images.icons.home}
                    customStyle={[styles.iconTabBar, {tintColor}]}
                />
            </StyleTouchable>
        );
    };

    const RenderMessageButton = () => {
        let tintColor = theme.tabBarIconColor;
        if (tabIndexFocus === 1) {
            tintColor = Theme.common.white;
        } else if (numberNewMessages > 0) {
            tintColor = theme.highlightColor;
        }
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(MAIN_SCREEN.messRoute)}>
                <View>
                    <StyleImage
                        source={Images.icons.chat}
                        customStyle={[styles.iconTabBar, {tintColor}]}
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
    };

    const RenderCreatePostButton = () => {
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={onGoToCreatePost}>
                <StyleImage
                    source={Images.icons.plus}
                    customStyle={[
                        styles.iconTabBar,
                        {tintColor: theme.tabBarIconColor},
                    ]}
                />
            </StyleTouchable>
        );
    };

    const RenderCreateGroupButton = () => {
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={onGoToCreateGroup}>
                <StyleImage
                    source={Images.icons.createGroup}
                    customStyle={[
                        styles.iconTabBar,
                        {tintColor: theme.tabBarIconColor},
                    ]}
                />
            </StyleTouchable>
        );
    };

    const RenderProfileButton = () => {
        return (
            <StyleTouchable
                onPress={() => {
                    if (tabIndexFocus !== 2) {
                        navigate(MAIN_SCREEN.profileRoute);
                    } else {
                        navigate(PROFILE_ROUTE.myProfile);
                    }
                }}
                customStyle={styles.profileView}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.profile}
                />
            </StyleTouchable>
        );
    };

    const RenderNotificationButton = () => {
        return (
            <StyleTouchable
                customStyle={styles.notificationView}
                onPress={() => navigate(MAIN_SCREEN.notificationRoute)}>
                <StyleImage
                    source={Images.icons.notification}
                    customStyle={[
                        styles.iconTabBar,
                        {tintColor: theme.tabBarIconColor},
                    ]}
                />
                {numberNewNotifications > 0 && (
                    <View style={styles.newNotificationBox}>
                        <StyleText
                            originValue={numberNewNotifications}
                            customStyle={styles.textNewMessages}
                        />
                    </View>
                )}
            </StyleTouchable>
        );
    };

    const RenderTabBarIndicator = () => {
        return (
            <Animated.View
                style={[
                    styles.indicatorView,
                    {
                        width: indicatorWidth,
                        height: moderateScale(40),
                        transform: [
                            {
                                translateX: indicatorTranslateX,
                            },
                            {
                                translateY: indicatorTranslateY,
                            },
                        ],
                    },
                ]}>
                <LinearGradient
                    colors={[
                        Theme.common.gradientTabBar1,
                        Theme.common.gradientTabBar2,
                    ]}
                    style={styles.gradientBox}
                />
            </Animated.View>
        );
    };

    const RenderAddMore = () => {
        return (
            <View
                style={[
                    styles.addMoreView,
                    {
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                {/* <AnimatedLinear
                    colors={[
                        Theme.common.gradientTabBar1,
                        Theme.common.gradientTabBar2,
                    ]}
                    style={[
                        styles.addMoreGradient,
                        {
                            width: addMoreWidth,
                        },
                    ]}
                /> */}
            </View>
        );
    };

    return (
        <>
            {RenderProfileButton()}
            {RenderNotificationButton()}

            {RenderAddMore()}
            <Animated.View
                style={[
                    styles.tabBarDown,
                    {
                        height,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                {RenderTabBarIndicator()}
                {RenderDiscoveryButton()}
                {RenderMessageButton()}
                {RenderCreatePostButton()}
                {RenderCreateGroupButton()}
            </Animated.View>
        </>
    );
};

const styles = ScaledSheet.create({
    // Tab bar up
    tabBarUp: {
        position: 'absolute',
        width: '100%',
        height: '45@ms',
        marginTop: Metrics.safeTopPadding,
        paddingHorizontal: '20@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationView: {
        flexDirection: 'row',
        height: '35@ms',
        position: 'absolute',
        alignItems: 'center',
        top: moderateScale(5),
        right: '20@s',
    },
    newNotificationBox: {
        right: '7@ms',
        top: '-7@ms',
        width: '15@ms',
        height: '15@ms',
        backgroundColor: 'red',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileView: {
        position: 'absolute',
        top: moderateScale(5),
        left: '20@s',
    },
    profile: {
        width: '35@ms',
        height: '35@ms',
        borderRadius: '20@ms',
    },
    addMoreView: {
        width: '100%',
        height: '10@ms',
        alignItems: 'center',
    },
    addMoreGradient: {
        height: '100%',
    },
    // Tab bar down
    tabBarDown: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '20@s',
        overflow: 'hidden',
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTabBar: {
        width: '25@ms',
        height: '25@ms',
    },
    newMessagesBox: {
        position: 'absolute',
        width: '18@ms',
        height: '18@ms',
        backgroundColor: 'red',
        right: '-7@ms',
        top: '-3@ms',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNewMessages: {
        fontSize: '10@ms',
        color: 'white',
    },
    zoomPhoto: {
        position: 'absolute',
        width: '60%',
        height: '60%',
    },
    // tabBar indicator
    indicatorView: {
        position: 'absolute',
        left: '20@s',
        height: '100%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    gradientBox: {
        width: '70%',
        height: '100%',
        borderRadius: '20@ms',
    },
});

export default TabNavigator;
