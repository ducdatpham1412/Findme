import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef} from 'react';
import {Animated, Platform} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';

export const headerDoffyHeight = verticalScale(45);

interface Props {
    isShowHeader: boolean;
}

const HeaderDoffy = (props: Props) => {
    const {isShowHeader} = props;
    const theme = Redux.getTheme();

    const aim = useRef(new Animated.Value(0)).current;

    const translateY = aim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -headerDoffyHeight],
    });

    const opacity = aim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.3],
    });

    useEffect(() => {
        if (isShowHeader) {
            Animated.timing(aim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(aim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [isShowHeader]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    borderBottomColor: theme.borderColor,
                    transform: [{translateY}],
                    opacity,
                },
            ]}>
            <StyleText
                originValue="DOFFY"
                customStyle={[styles.doffyText, {color: theme.textColor}]}
            />
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: headerDoffyHeight,
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingHorizontal: '20@s',
        justifyContent: 'center',
    },
    doffyText: {
        fontSize: '18@ms',
        fontWeight: 'bold',
    },
});

export default HeaderDoffy;
