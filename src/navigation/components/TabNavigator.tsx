import {StyleIcon, StyleTouchable} from 'components/base';
import {sendBubblePalace} from 'hook/useSocket';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {openPlusBox} from 'utility/assistant';

/**
 * Button circle in the middle
 * 1. Show iconPlus if not have any bubble
 * 2. Show indexBubble of listBubbles
 * 3. Disable when open BubblePushFrame
 */

const TabNavigator = (props?: any) => {
    const theme = Redux.getTheme();
    const {listBubbles} = Redux.getResource();
    const indexBubble = Redux.getIndexBubble();
    const isDisplayBubbleFrame = Redux.getDisplayBubbleFrame();
    const {setShowTabBar} = useTabBar();

    // routes[0] is discovery screen
    const routeDis = props.state.routes[0];
    // routes[1] is profile screen
    const routePro = props.state.routes[1];

    const [focused, setFocused] = useState(routeDis.name);

    const {showTabBar, disableTabBar} = useTabBar();
    const aim = useRef(new Animated.Value(0)).current;
    const translateY = aim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    const controlTabBar = () => {
        if (!showTabBar || disableTabBar) {
            Animated.timing(aim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(aim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    useEffect(() => {
        controlTabBar();
    }, [showTabBar, disableTabBar]);

    const onLongPressPushBtn = () => {
        if (focused === routeDis.name) {
            Redux.setDisplayBubbleFrame(true);
        }
    };
    const onPressPushBtn = () => {
        if (focused === routeDis.name) {
            if (listBubbles.length) {
                sendBubblePalace(listBubbles[indexBubble]);
            } else {
                openPlusBox(setShowTabBar);
            }
        }
    };

    return (
        <Animated.View
            style={[
                styles.tabBar,
                {
                    opacity: aim,
                    transform: [{translateY}],
                    borderColor: theme.borderColor,
                },
            ]}>
            <View
                style={[styles.spaceBg, {backgroundColor: theme.tabBarColor}]}
            />

            {/* DISCOVERY BUTTON */}
            <View style={styles.button}>
                <StyleTouchable
                    onPress={() => {
                        navigate(routeDis.name);
                        setFocused(routeDis.name);
                    }}>
                    <Entypo
                        name="compass"
                        size={moderateScale(25)}
                        color={theme.tabBarIconColor}
                        style={{
                            opacity: focused === routeDis.name ? 1 : 0.4,
                        }}
                    />
                </StyleTouchable>
            </View>

            {/* PUSH BUTTON */}
            <StyleTouchable
                customStyle={styles.buttonPush}
                onLongPress={onLongPressPushBtn}
                onPress={onPressPushBtn}
                disable={isDisplayBubbleFrame}>
                <View
                    style={[
                        styles.spaceBg,
                        {backgroundColor: theme.tabBarColor, opacity: 0.8},
                    ]}
                />
                {listBubbles.length ? (
                    <StyleIcon
                        source={{uri: listBubbles[indexBubble].icon}}
                        size={25}
                        customStyle={styles.indexBubbleNow}
                    />
                ) : (
                    <Entypo
                        name="plus"
                        size={moderateScale(25)}
                        color={theme.tabBarIconColor}
                        style={{opacity: 0.7}}
                    />
                )}
            </StyleTouchable>

            {/* PROFILE BUTTON */}
            <View style={styles.button}>
                <StyleTouchable
                    onPress={() => {
                        if (focused === routePro.name) {
                            // navigate(routePro.name, {
                            //     screen: PROFILE_ROUTE.profileScreen,
                            //     resetToMyProfile: 'reset',
                            // });
                            navigate(PROFILE_ROUTE.myProfile);
                        } else {
                            navigate(routePro.name);
                        }
                        setFocused(routePro.name);
                    }}>
                    <Feather
                        name="user"
                        style={{
                            fontSize: moderateScale(25),
                            color: theme.tabBarIconColor,
                            opacity: focused === routePro.name ? 1 : 0.4,
                        }}
                    />
                </StyleTouchable>
            </View>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    tabBar: {
        position: 'absolute',
        zIndex: 1,
        width: '200@s',
        height: '40@vs',
        bottom: '15@vs',
        // backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.5,
        borderRadius: '30@vs',
    },
    spaceBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: '30@vs',
        opacity: 0.4,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPush: {
        height: '40@vs',
        width: '50@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '40@s',
        marginTop: '-20@vs',
        overflow: 'visible',
    },
    indexBubbleNow: {
        borderRadius: '100@s',
    },
});

export default TabNavigator;
