import Images from 'asset/img/images';
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
import Feather from 'react-native-vector-icons/Feather';

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
    const scale = useRef(new Animated.Value(1)).current;

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
        Animated.spring(indicatorTranslateX, {
            toValue: indicatorWidth * tabIndexFocus,
            useNativeDriver: true,
        }).start();
        if (tabIndexFocus === 4) {
            Animated.spring(scale, {
                toValue: 0.3,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [tabIndexFocus]);

    const onGoToCreatePost = () => {
        navigate(PROFILE_ROUTE.createPostPreview);
    };

    /**
     * Render view
     */
    const DiscoveryButton = () => {
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

    const MessageButton = () => {
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

    const CreatePostButton = () => {
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={onGoToCreatePost}>
                <LinearGradient
                    colors={[
                        Theme.common.gradientTabBar1,
                        Theme.common.gradientTabBar2,
                    ]}
                    style={styles.createBox}>
                    <Feather name="plus" style={styles.iconCreate} />
                </LinearGradient>
            </StyleTouchable>
        );
    };

    const ProfileButton = () => {
        return (
            <StyleTouchable
                onPress={() => {
                    if (tabIndexFocus !== 2) {
                        navigate(MAIN_SCREEN.profileRoute);
                    } else {
                        navigate(PROFILE_ROUTE.myProfile);
                    }
                }}
                customStyle={styles.buttonView}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.profile}
                />
            </StyleTouchable>
        );
    };

    const NotificationButton = () => {
        const tintColor =
            tabIndexFocus === 3 ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(MAIN_SCREEN.notificationRoute)}>
                <View
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                    }}>
                    <StyleImage
                        source={Images.icons.notification}
                        customStyle={[styles.iconTabBar, {tintColor}]}
                    />
                    {numberNewNotifications > 0 && (
                        <View style={styles.newNotificationBox}>
                            <StyleText
                                originValue={numberNewNotifications}
                                customStyle={styles.textNewMessages}
                            />
                        </View>
                    )}
                </View>
            </StyleTouchable>
        );
    };

    const TabBarIndicator = () => {
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
                                scale,
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

    const AddMore = () => {
        return (
            <View
                style={[
                    styles.addMoreView,
                    {
                        backgroundColor: theme.backgroundColor,
                        borderTopColor: theme.borderColor,
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
            {AddMore()}
            <Animated.View
                style={[
                    styles.tabBarDown,
                    {
                        height,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                {TabBarIndicator()}
                {DiscoveryButton()}
                {MessageButton()}
                {CreatePostButton()}
                {NotificationButton()}
                {ProfileButton()}
            </Animated.View>
        </>
    );
};

const styles = ScaledSheet.create({
    newNotificationBox: {
        position: 'absolute',
        width: '15@ms',
        height: '15@ms',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        top: '9@ms',
        right: '-5@ms',
    },
    profile: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '20@ms',
    },
    addMoreView: {
        width: '100%',
        height: '5@ms',
        alignItems: 'center',
        borderTopWidth: '0.25@ms',
    },
    addMoreGradient: {
        height: '100%',
    },
    // Tab bar down
    tabBarDown: {
        width: '100%',
        flexDirection: 'row',
        overflow: 'hidden',
        paddingHorizontal: '5@s',
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
    createBox: {
        paddingHorizontal: '8@ms',
        paddingVertical: '2@ms',
        borderRadius: '7@ms',
    },
    iconCreate: {
        fontSize: '20@ms',
        color: Theme.common.white,
    },
    newMessagesBox: {
        position: 'absolute',
        width: '15@ms',
        height: '15@ms',
        right: '-5@ms',
        top: '-3@ms',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    textNewMessages: {
        fontSize: '8@ms',
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
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        left: '5@s',
    },
    gradientBox: {
        width: '75%',
        height: '90%',
        borderRadius: '20@ms',
    },
});

export default TabNavigator;
