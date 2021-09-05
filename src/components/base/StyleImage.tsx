import React from 'react';
import {Image, ImageProps, ImageStyle, StyleProp} from 'react-native';

interface StyleImageProps extends ImageProps {
    customStyle?: StyleProp<ImageStyle>;
}

const StyleImage = (props: StyleImageProps) => {
    const {customStyle} = props;

    return <Image style={customStyle} resizeMode="contain" {...props} />;
};

export default StyleImage;
