import {StyleTouchable} from 'components/base';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleProp, TextStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
    onPress(): void;
    customStyle?: StyleProp<TextStyle>;
}

const IconLiked = ({onPress, customStyle}: Props) => {
    const aim = useRef(new Animated.Value(5)).current;

    useEffect(() => {
        Animated.spring(aim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{transform: [{scale: aim}]}}>
            <StyleTouchable onPress={onPress} hitSlop={14}>
                <FontAwesome
                    name="heart"
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
