import {TypeCreatePostResponse} from 'api/interface';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleTouchable} from 'components/base';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {StyleProp, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    itemPost: TypeCreatePostResponse;
    onGoToDetailPost(bubble: string): void;
    containerStyle?: StyleProp<ViewStyle>;
}

const PostStatus = (props: Props) => {
    const {itemPost, onGoToDetailPost, containerStyle} = props;
    const imageUrl = itemPost.images[0] || '';

    const arrayStars = Array(itemPost.stars).fill(0);

    return (
        <StyleTouchable
            customStyle={[styles.container, containerStyle]}
            onPress={() => onGoToDetailPost(itemPost.id)}
            activeOpacity={0.95}
            onTouchEnd={() => {
                // console.log(
                //     'with element: ',
                //     e.nativeEvent.locationX,
                //     ' - ',
                //     e.nativeEvent.locationY,
                // );
            }}>
            <StyleImage source={{uri: imageUrl}} customStyle={styles.image} />
            <LinearGradient
                colors={[
                    Theme.common.gradientTabBar1,
                    Theme.common.gradientTabBar2,
                ]}
                style={styles.starView}>
                {arrayStars.map((_, index) => (
                    <AntDesign key={index} name="star" style={styles.star} />
                ))}
            </LinearGradient>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width / 3 - moderateScale(0.5),
        height: Metrics.width / 3 + scale(30),
        marginBottom: '0.75@ms',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    starView: {
        position: 'absolute',
        right: '5@s',
        bottom: '5@s',
        paddingVertical: '2@vs',
        paddingHorizontal: '7@s',
        flexDirection: 'row',
        borderRadius: '2@s',
    },
    star: {
        fontSize: '8@ms',
        marginHorizontal: '1@s',
        color: Theme.common.orange,
    },
});

export default memo(PostStatus, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.itemPost, nextProps.itemPost)) {
        return false;
    }
    return true;
});
