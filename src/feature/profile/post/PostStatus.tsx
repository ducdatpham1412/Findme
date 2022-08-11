import {TypeCreatePostResponse} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

interface Props {
    itemPost: TypeCreatePostResponse;
    onGoToDetailPost(bubble: string): void;
}

const PostStatus = (props: Props) => {
    const {itemPost, onGoToDetailPost} = props;
    const {profile} = Redux.getPassport();
    const imageUrl = itemPost.images[0] || profile.avatar;

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={() => onGoToDetailPost(itemPost.id)}>
            <StyleImage source={{uri: imageUrl}} customStyle={styles.image} />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width / 3 - moderateScale(1),
        height: Metrics.width / 3 + moderateScale(20),
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default memo(PostStatus, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.itemPost, nextProps.itemPost)) {
        return false;
    }
    return true;
});
