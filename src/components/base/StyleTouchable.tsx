/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleProp,
    View,
    ViewStyle,
} from 'react-native';

interface StyleTouchableProps extends PressableProps {
    customStyle?: StyleProp<ViewStyle>;
    customOpacity?: number;
    customBgColor?: string;
    disable?: boolean;
    onPress?(): void;
    onLongPress?(): void;
}

const StyleTouchable: React.FunctionComponent<StyleTouchableProps> = (
    props: StyleTouchableProps,
) => {
    const {
        customStyle,
        customOpacity,
        customBgColor = 'white',
        disable = false,
        onPress,
        onLongPress,
        children,
    } = props;

    return (
        <Pressable
            style={({pressed}) => [
                customStyle,
                {
                    opacity: disable ? 0.4 : pressed ? 0.6 : customOpacity || 1,
                    overflow: 'hidden',
                },
            ]}
            disabled={disable}
            onPress={onPress}
            onLongPress={onLongPress}>
            {customOpacity && (
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        backgroundColor: customBgColor,
                        opacity: customOpacity,
                    }}
                />
            )}
            {children}
        </Pressable>
    );
};

export default StyleTouchable;
