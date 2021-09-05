import React from 'react';
import {Pressable, PressableProps, StyleProp, ViewStyle} from 'react-native';

interface StyleTouchableProps extends PressableProps {
    customStyle?: StyleProp<ViewStyle>;
    disable?: boolean;
    onPress?(): void;
    onLongPress?(): void;
    disableOpacity?: number;
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
    } = props;

    return (
        <Pressable
            style={({pressed}) => [
                customStyle,
                {
                    opacity: disable ? disableOpacity : pressed ? 0.6 : 1,
                    overflow: 'hidden',
                },
            ]}
            disabled={disable}
            onPress={onPress}
            onLongPress={onLongPress}
            {...props}>
            {children}
        </Pressable>
    );
};

export default StyleTouchable;
