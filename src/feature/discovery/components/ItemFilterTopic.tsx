import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef} from 'react';
import {Animated, ImageStyle, StyleProp} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    isChosen: boolean;
    icon: any;
    iconStyle?: StyleProp<ImageStyle>;
    title: I18Normalize;
    onPressTopic(): void;
}

const ItemFilterTopic = (props: Props) => {
    const {isChosen, icon, title, onPressTopic, iconStyle} = props;
    const scale = useRef(new Animated.Value(1)).current;
    const theme = Redux.getTheme();

    useEffect(() => {
        Animated.spring(scale, {
            toValue: isChosen ? 1 : 0.65,
            useNativeDriver: true,
        }).start();
    }, [isChosen]);

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={onPressTopic}
            activeOpacity={0.6}>
            <Animated.View
                style={[
                    styles.container,
                    {transform: [{scale}], opacity: isChosen ? 1 : 0.65},
                ]}>
                <StyleIcon source={icon} size={50} customStyle={iconStyle} />
                <StyleText
                    i18Text={title}
                    customStyle={[styles.title, {color: theme.textColor}]}
                />
            </Animated.View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '12@ms',
        marginTop: '5@vs',
    },
});

export default ItemFilterTopic;
