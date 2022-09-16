import {StyleTouchable} from 'components/base';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    onPress(): void;
    customStyle?: StyleProp<TextStyle>;
    touchableStyle?: StyleProp<ViewStyle>;
}

const IconLiked = ({onPress, customStyle, touchableStyle}: Props) => {
    const aim = useRef(new Animated.Value(5)).current;

    useEffect(() => {
        Animated.spring(aim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{transform: [{scale: aim}]}}>
            <StyleTouchable
                onPress={onPress}
                hitSlop={14}
                customStyle={touchableStyle}>
                <AntDesign
                    name="star"
                    style={[styles.heartIcon, customStyle]}
                />
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    heartIcon: {
        fontSize: '40@ms',
    },
});

export default IconLiked;
