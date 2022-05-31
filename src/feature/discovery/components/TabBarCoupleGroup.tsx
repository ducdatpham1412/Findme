import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleTouchable} from 'components/base';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {Animated, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

interface Props {
    materialProps: MaterialTopTabBarProps;
}

const TabBarCoupleGroup = (props: Props) => {
    const {materialProps} = props;
    const {state, navigation, position} = materialProps;

    const isFocusCouple = state.index === 0;

    const imageBackground = isFocusCouple
        ? Images.images.skyCouple
        : Images.images.skyGroup;
    const iconTab = isFocusCouple
        ? Images.icons.personal
        : Images.icons.community;

    const translateX = position.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateScale(-14), moderateScale(14)],
    });

    const onSwitchTab = () => {
        if (isFocusCouple) {
            navigation.navigate(DISCOVERY_ROUTE.listBubbleGroup);
        } else {
            navigation.navigate(DISCOVERY_ROUTE.listBubbleCouple);
        }
    };

    return (
        <View style={styles.container}>
            <StyleTouchable
                customStyle={styles.switchView}
                onPress={onSwitchTab}
                activeOpacity={0.95}>
                <StyleImage
                    source={imageBackground}
                    customStyle={styles.imageBackground}
                    resizeMode="stretch"
                />
                <Animated.View
                    style={[styles.switchRound, {transform: [{translateX}]}]}>
                    <StyleImage source={iconTab} customStyle={styles.iconTab} />
                </Animated.View>
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
        height: '45@ms',
        justifyContent: 'center',
    },
    switchView: {
        width: '60@ms',
        height: '30@ms',
        borderRadius: '40@ms',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    switchRound: {
        width: '28@ms',
        height: '28@ms',
        borderRadius: '20@ms',
        backgroundColor: Theme.common.comment,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTab: {
        width: '65%',
        height: '65%',
    },
});

export default TabBarCoupleGroup;
