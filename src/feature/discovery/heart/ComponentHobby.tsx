/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {useRef} from 'react';
import {useEffect} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

export interface HobbyType {
    name: String;
    icon: any;
    liked: boolean;
    onPress: any;
}

const ComponentHobby = (props: HobbyType) => {
    const theme = useRedux().getTheme();
    const {name, icon, liked, onPress} = props;
    const textColor = liked ? theme.highlightColor : theme.textColor;

    const translateY = useRef<any>(new Animated.Value(liked ? 300 : 0)).current;

    useEffect(() => {
        if (liked) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    borderColor: textColor,
                    opacity: liked ? 1 : 0.7,
                    transform: [{translateY}],
                },
            ]}>
            <View style={styles.iconView}>
                <StyleIcon
                    source={{uri: icon}}
                    size={12}
                    customStyle={{tintColor: textColor}}
                />
            </View>
            <StyleTouchable customStyle={styles.touchView} onPress={onPress}>
                <StyleText
                    originValue={name}
                    customStyle={[styles.text, {color: textColor}]}
                />
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: '50@vs',
        marginHorizontal: '10@s',
        marginVertical: '10@vs',
        flexDirection: 'row',
    },
    iconView: {
        justifyContent: 'center',
        paddingLeft: '15@s',
    },
    icon: {
        fontSize: '15@ms',
    },
    touchView: {
        paddingVertical: '7@vs',
        paddingHorizontal: '15@s',
    },
    text: {
        fontSize: '15@ms',
    },
});

export default ComponentHobby;
