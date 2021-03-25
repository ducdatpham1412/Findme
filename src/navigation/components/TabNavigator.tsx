/*eslint-disable react-hooks/exhaustive-deps */
/*eslint-disable react-native/no-inline-styles */
import Images from 'asset/img/images';
import {StyleImage, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import {navigate} from 'navigation/NavigationService';
import {useTabBar} from 'navigation/config/TabBarProvider';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, View, Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

const win = Dimensions.get('screen').width;
const tabBarSize = win * 0.6;
const buttonSize = tabBarSize / 3;

const TabNavigator = (props?: any) => {
    const Redux = useRedux();
    const theme = Redux.getTheme();
    const gender = Redux.getProfile().info?.gender;
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
        // console.log(showTabBar);
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

    return (
        <Animated.View
            style={[
                styles.tabBar,
                {
                    backgroundColor: theme.tabBarColor,
                    opacity: aim,
                    transform: [{translateY}],
                },
            ]}>
            {/* DISCOVERY BUTTON */}
            <View style={styles.button}>
                <StyleTouchable
                    onPress={() => {
                        setFocused(routeDis.name);
                        navigate(routeDis.name);
                    }}>
                    <Entypo
                        name="compass"
                        size={33}
                        color={theme.tabBarIconColor}
                        style={{
                            opacity: focused === routeDis.name ? 1 : 0.3,
                        }}
                    />
                </StyleTouchable>
            </View>

            {/* PUSH BUTTON */}
            <View
                style={[
                    styles.buttonPush,
                    {backgroundColor: theme.tabBarColor},
                ]}>
                <StyleTouchable>
                    <StyleImage
                        source={Images.pushIcon}
                        customStyle={{
                            opacity: 0.3,
                            tintColor: theme.tabBarIconColor,
                        }}
                    />
                </StyleTouchable>
            </View>

            {/* PROFILE BUTTON */}
            <View style={styles.button}>
                <StyleTouchable
                    onPress={() => {
                        setFocused(routePro.name);
                        navigate(routePro.name);
                    }}>
                    <SimpleLineIcon
                        name={gender === 'man' ? 'user' : 'user-female'}
                        style={{
                            fontSize: 28,
                            color: theme.tabBarIconColor,
                            opacity: focused === routePro.name ? 1 : 0.3,
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
        width: tabBarSize,
        height: '45@vs',
        bottom: '8@vs',
        backgroundColor: 'white',
        borderRadius: '30@vs',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPush: {
        flex: 1,
        height: buttonSize,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: buttonSize,
    },
});

export default TabNavigator;
