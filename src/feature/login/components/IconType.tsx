import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface IconTypeProps {
    source: any;
    originTitle?: string;
    i18Title?: string;
    iconTouchStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<ImageStyle>;
    textUnderStyle?: StyleProp<TextStyle>;
    onPress?(): void;
}

const IconType = (props: IconTypeProps) => {
    const theme = useRedux().getTheme();
    const {
        source,
        originTitle,
        i18Title,
        iconTouchStyle,
        iconStyle,
        textUnderStyle,
        onPress,
    } = props;

    return (
        <StyleTouchable
            customStyle={[styles.iconTouch, iconTouchStyle]}
            onPress={onPress}>
            <StyleImage
                source={source}
                customStyle={[styles.icon, iconStyle]}
            />
            <StyleText
                originValue={originTitle}
                i18Text={i18Title}
                customStyle={[
                    styles.textUnderIcon,
                    {color: theme.textColor},
                    textUnderStyle,
                ]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    iconTouch: {
        flex: 1,
        height: '70@vs',
        alignItems: 'center',
    },
    icon: {
        flex: 1,
        resizeMode: 'contain',
        marginBottom: '7@vs',
    },
    textUnderIcon: {
        fontSize: 11,
        fontWeight: 'bold',
    },
});

export default IconType;
