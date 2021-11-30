import React from 'react';
import {Pressable, PressableProps, StyleProp, ViewStyle} from 'react-native';

interface StyleTouchableProps extends PressableProps {
    customStyle?: StyleProp<ViewStyle>;
    disable?: boolean;
    onPress?(): void;
    onDoublePress?(): void;
    onLongPress?(): void;
    disableOpacity?: number;
    activeOpacity?: number;
    normalOpacity?: number;
}

let checkTimeOut: any;

const StyleTouchable: React.FunctionComponent<StyleTouchableProps> = (
    props: StyleTouchableProps,
) => {
    const {
        customStyle,
        disable = false,
        onPress,
        onDoublePress,
        onLongPress,
        children,
        disableOpacity = 0.4,
        activeOpacity = 0.6,
        normalOpacity = 1,
    } = props;
    let numberClicks = 0;

    const onCheckPress = () => {
        if (onDoublePress) {
            numberClicks++;
            if (numberClicks === 1) {
                checkTimeOut = setTimeout(() => {
                    numberClicks = 0;
                    onPress?.();
                }, 10);
            } else if (numberClicks === 2) {
                clearTimeout(checkTimeOut);
                numberClicks = 0;
                onDoublePress?.();
            }
        } else {
            onPress?.();
        }
    };

    return (
        <Pressable
            style={({pressed}) => [
                customStyle,
                {
                    opacity: disable
                        ? disableOpacity
                        : pressed
                        ? activeOpacity
                        : normalOpacity,
                    overflow: 'hidden',
                },
            ]}
            disabled={disable}
            {...props}
            onPress={onCheckPress}
            onLongPress={onLongPress}>
            {children}
        </Pressable>
    );
};

export default StyleTouchable;
