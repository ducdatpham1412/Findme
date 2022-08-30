import React from 'react';
import {ImageProps, StyleProp, View, ViewStyle} from 'react-native';
import Pinchable from 'react-native-pinchable';
import {StyleImage} from './base';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    imageProps: ImageProps;
}

const PinchImage = (props: Props) => {
    return (
        <View style={props.containerStyle}>
            <Pinchable>
                <StyleImage {...props.imageProps} />
            </Pinchable>
        </View>
    );
};

export default PinchImage;
