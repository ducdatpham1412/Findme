import React, {useEffect, useState} from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import {StyleImage} from './base';

interface Props {
    uri: string;
    customStyle?: StyleProp<ImageStyle>;
}

const AutoHeightImage = (props: Props) => {
    const {uri, customStyle} = props;

    const [ratio, setRatio] = useState(0);
    const [checkWidth, setCheckWidth] = useState(0);
    const [checkHeight, setCheckHeight] = useState(0);

    useEffect(() => {
        Image.getSize(uri, (width, height) => {
            setRatio(height / width);
        });
    }, []);

    useEffect(() => {
        if (checkWidth && ratio) {
            setCheckHeight(ratio * checkWidth);
        }
    }, [checkWidth, ratio]);

    return (
        <StyleImage
            source={{uri}}
            customStyle={[{height: checkHeight}, customStyle]}
            onLayout={e => setCheckWidth(e.nativeEvent.layout.width)}
        />
    );
};

export default AutoHeightImage;
