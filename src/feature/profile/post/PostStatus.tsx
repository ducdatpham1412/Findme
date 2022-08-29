import {TypeBubblePalace} from 'api/interface';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {StyleProp, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    itemPost: TypeBubblePalace;
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
            activeOpacity={0.95}>
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
            {itemPost.isDraft && (
                <View style={styles.draftView}>
                    <StyleText
                        i18Text="profile.draftPost"
                        customStyle={styles.textDraft}
                    />
                </View>
            )}
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
    draftView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Theme.darkTheme.backgroundOpacity(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textDraft: {
        fontSize: '14@ms',
        color: Theme.common.white,
    },
});

export default memo(PostStatus, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.itemPost, nextProps.itemPost)) {
        return false;
    }
    return true;
});
