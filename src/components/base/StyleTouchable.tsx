import React from 'react';
import {Pressable, PressableProps, StyleProp, ViewStyle} from 'react-native';

export interface StyleTouchableProps extends PressableProps {
    customStyle?: StyleProp<ViewStyle>;
    disable?: boolean;
    onPress?(): void;
    onLongPress?(): void;
    disableOpacity?: number;
    activeOpacity?: number;
    normalOpacity?: number;
}

const StyleTouchable: React.FunctionComponent<StyleTouchableProps> = (
    props: StyleTouchableProps,
) => {
    const {
        customStyle,
        disable = false,
        onPress,
        onLongPress,
        children,
        disableOpacity = 0.4,
        activeOpacity = 0.6,
        normalOpacity = 1,
    } = props;

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
            onPress={onPress}
            onLongPress={onLongPress}>
            {children}
        </Pressable>
    );
};

export default StyleTouchable;
