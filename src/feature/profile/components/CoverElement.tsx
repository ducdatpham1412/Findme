import {StyleImage} from 'components/base';
import React from 'react';
import {ImageStyle, StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface CoverElementProps {
    cover: string;
    customStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const CoverElement = (props: CoverElementProps) => {
    const {cover, customStyle, imageStyle} = props;

    return (
        <View style={[styles.imageCover, customStyle]}>
            <StyleImage
                source={{uri: cover}}
                customStyle={[styles.imageCover, imageStyle]}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    coverView: {
        flex: 1,
    },
    imageCover: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: '25@vs',
        borderTopRightRadius: '25@vs',
    },
});

export default CoverElement;
