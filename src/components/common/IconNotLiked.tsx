import Theme from 'asset/theme/Theme';
import {StyleTouchable} from 'components/base';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleProp, TextStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    onPress(): void;
    customStyle?: StyleProp<TextStyle>;
}

const IconNotLiked = ({onPress, customStyle}: Props) => {
    const aim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(aim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{transform: [{scale: aim}]}}>
            <StyleTouchable onPress={onPress}>
                <AntDesign
                    name="heart"
                    style={[styles.heartNotLikeIcon, customStyle]}
                />
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    heartNotLikeIcon: {
        fontSize: '40@ms',
        color: Theme.common.white,
    },
});

export default IconNotLiked;