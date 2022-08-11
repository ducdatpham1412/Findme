import {Metrics} from 'asset/metrics';
import {StyleImage} from 'components/base';
import React, {forwardRef, useEffect, useState} from 'react';
import {Image, ScrollView, ScrollViewProps, View} from 'react-native';

interface Props {
    images: Array<string>;
    syncWidth?: number;
    scrollViewProps?: ScrollViewProps;
}

const ScrollSyncSizeImage = (props: Props, ref: any) => {
    const {images, syncWidth = Metrics.width, scrollViewProps} = props;

    const [ratio, setRatio] = useState(0);

    useEffect(() => {
        if (images[0]) {
            Image.getSize(images[0], (width, height) => {
                setRatio(height / width);
            });
        }
    }, [images[0]]);
    const height = ratio * syncWidth;

    return (
        <View
            style={{
                width: syncWidth,
                height,
            }}>
            <ScrollView
                ref={ref}
                horizontal
                snapToInterval={syncWidth}
                decelerationRate="fast"
                scrollEventThrottle={16}
                {...scrollViewProps}>
                {images.map(url => (
                    <StyleImage
                        key={url}
                        source={{uri: url}}
                        customStyle={{
                            width: syncWidth,
                            height,
                        }}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default forwardRef(ScrollSyncSizeImage);
