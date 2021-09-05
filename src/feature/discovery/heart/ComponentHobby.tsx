import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import Redux, {HobbyType} from 'hook/useRedux';
import React from 'react';
import {useRef} from 'react';
import {useEffect} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    item: HobbyType;
    onPress: any;
}

const ComponentHobby = (props: Props) => {
    const theme = Redux.getTheme();
    const {item, onPress} = props;
    const textColor = item.liked ? theme.highlightColor : theme.textColor;

    const translateY = useRef<any>(
        new Animated.Value(item.liked ? 300 : 0),
    ).current;

    useEffect(() => {
        if (item.liked) {
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
                    opacity: item.liked ? 1 : 0.7,
                    transform: [{translateY}],
                },
            ]}>
            <View style={styles.iconView}>
                <StyleIcon source={{uri: item.icon}} size={12} />
            </View>
            <StyleTouchable customStyle={styles.touchView} onPress={onPress}>
                <StyleText
                    originValue={item.name}
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
