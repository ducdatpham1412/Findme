import React from 'react';
import {Image, ImageProps, ImageStyle, StyleProp} from 'react-native';
import {scale} from 'react-native-size-matters';

interface StyleIconProps extends ImageProps {
    size?: number;
    customStyle?: StyleProp<ImageStyle>;
}

const StyleIcon = (props: StyleIconProps) => {
    const {size = 1, customStyle} = props;

    return (
        <Image
            style={[{width: scale(size), height: scale(size)}, customStyle]}
            resizeMode="contain"
            {...props}
        />
    );
};

export default StyleIcon;
