import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {chooseIconHobby} from 'utility/assistant';

interface Props {
    color: number;
}

const IconHobby = ({color}: Props) => {
    const aim = useRef(new Animated.Value(0)).current;
    const degree = aim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        Animated.loop(
            Animated.timing(aim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    return (
        <Animated.Image
            source={{uri: chooseIconHobby(color)}}
            style={[
                styles.iconHobby,
                {
                    transform: [{rotate: degree}],
                },
            ]}
        />
    );
};

const styles = ScaledSheet.create({
    iconHobby: {
        width: '50@s',
        height: '50@s',
        marginBottom: '30@vs',
    },
});

export default IconHobby;
