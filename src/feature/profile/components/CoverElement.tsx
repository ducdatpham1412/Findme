import {StyleImage, StyleTouchable} from 'components/base';
import {showSwipeImages} from 'navigation/NavigationService';
import React from 'react';
import {ImageStyle, StyleProp, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface CoverElementProps {
    cover: string;
    customStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const CoverElement = (props: CoverElementProps) => {
    const {cover, customStyle, imageStyle} = props;

    const onSeeDetailCover = () => {
        showSwipeImages({
            listImages: [{url: cover}],
        });
    };

    return (
        <StyleTouchable
            customStyle={[styles.coverView, customStyle]}
            onPress={onSeeDetailCover}>
            <StyleImage
                source={{uri: cover}}
                customStyle={[styles.imageCover, imageStyle]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    coverView: {
        flex: 1,
    },
    imageCover: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: '40@vs',
        borderTopRightRadius: '40@vs',
    },
});

export default CoverElement;
