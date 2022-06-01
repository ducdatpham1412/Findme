import {TypeCreatePostResponse} from 'api/interface';
import {RELATIONSHIP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import AutoHeightImage from 'components/AutoHeightImage';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleMoreText from 'components/StyleMoreText';
import IconHobby from 'feature/discovery/components/IconHobby';
import {TypeShowMoreOptions} from 'feature/discovery/ListBubbleCouple';
import Redux from 'hook/useRedux';
import React, {memo, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {
    bubbleProfileHeight,
    bubbleProfileWidth,
    chooseColorGradient,
    logger,
} from 'utility/assistant';
import {TypeLikeUnlikeParams} from './ListDetailPost';

interface Props {
    item: TypeCreatePostResponse;
    onShowOptions(params: TypeShowMoreOptions): void;
    onRefreshItem(idBubble: string): Promise<void>;
    onShowModalComment(bubble: TypeCreatePostResponse): void;
    onLikeOrUnLike(params: TypeLikeUnlikeParams): Promise<void>;
    onSeeDetailImage(imageUrl: string): void;
}

const BubbleProfile = (props: Props) => {
    const {
        item,
        onShowOptions,
        onRefreshItem,
        onShowModalComment,
        onLikeOrUnLike,
        onSeeDetailImage,
    } = props;

    const theme = Redux.getTheme();
    const {gradient} = Redux.getResource();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);

    const color = chooseColorGradient({
        listGradients: gradient,
        colorChoose: item.color,
    });

    const avatar = item.creatorAvatar;

    const onLikeUnLike = () => {
        onLikeOrUnLike({
            isLiked,
            setIsLiked,
            totalLikes,
            setTotalLikes,
            bubbleId: item.id,
        });
    };

    useEffect(() => {
        setIsLiked(item.isLiked);
        setTotalLikes(item.totalLikes);
    }, [item.isLiked, item.totalLikes]);

    /**
     * Render view
     */
    const RenderImage = () => {
        const imageChoose = item.images[0] ? item.images[0] : avatar;
        const opacity = item.images[0] ? 1 : 0.3;

        const onShowNameBubble = () => {
            logger(item.name);
        };

        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onDoubleClick={() => {
                    if (!isLiked) {
                        onLikeUnLike();
                    } else {
                        onSeeDetailImage(imageChoose);
                    }
                }}>
                <AutoHeightImage
                    uri={imageChoose}
                    customStyle={[styles.image, {opacity}]}
                />

                <StyleTouchable
                    customStyle={styles.moreTouch}
                    onPress={() =>
                        onShowOptions({
                            idUser: item.creatorId,
                            imageWantToSee: imageChoose,
                        })
                    }
                    hitSlop={15}>
                    <StyleImage
                        source={Images.icons.more}
                        customStyle={styles.iconMore}
                        resizeMode="contain"
                    />
                </StyleTouchable>

                <IconHobby
                    bubbleId={item.id}
                    color={item.color}
                    containerStyle={styles.iconHobby}
                    onTouchStart={onShowNameBubble}
                />
            </StyleTouchHaveDouble>
        );
    };

    const RenderContentName = () => {
        const textColor =
            item.relationship === RELATIONSHIP.self
                ? theme.highlightColor
                : Theme.darkTheme.textHightLight;
        return (
            <LinearGradient
                colors={['transparent', Theme.darkTheme.backgroundColor]}
                style={styles.linearGradient}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}>
                <View style={styles.avatarNameContentView}>
                    <View>
                        <StyleImage
                            source={{uri: avatar}}
                            customStyle={styles.avatar}
                        />
                    </View>

                    <View style={styles.contentBox}>
                        <StyleText
                            originValue={`${item.creatorName}`}
                            customStyle={[styles.textName, {color: textColor}]}
                        />
                        <StyleMoreText
                            value={item.content}
                            textStyle={[
                                styles.textContent,
                                {color: Theme.common.white},
                            ]}
                            maxRows={2}
                            maxHeight={Metrics.height / 2}
                        />
                    </View>
                </View>
            </LinearGradient>
        );
    };

    const RenderTool = () => {
        const backgroundColor = theme.backgroundColor;

        const RenderStartChat = () => {
            return (
                <StyleTouchable
                    customStyle={[
                        styles.buttonTouch,
                        {
                            width: moderateScale(55),
                            height: moderateScale(55),
                            backgroundColor,
                        },
                    ]}
                    disable>
                    <StyleImage
                        source={Images.icons.chatNow}
                        customStyle={styles.iconChatNow}
                    />
                </StyleTouchable>
            );
        };

        const RenderIconLikeUnLike = () => {
            const iconColor = isLiked ? theme.likeHeart : theme.unLikeHeart;
            return (
                <View>
                    <StyleTouchable
                        customStyle={[styles.buttonTouch, {backgroundColor}]}
                        onPress={onLikeUnLike}
                        hitSlop={15}>
                        {isLiked ? (
                            <IconLiked
                                onPress={onLikeUnLike}
                                customStyle={[
                                    styles.iconLike,
                                    {color: iconColor},
                                ]}
                            />
                        ) : (
                            <IconNotLiked
                                onPress={onLikeUnLike}
                                customStyle={[
                                    styles.iconUnLike,
                                    {color: iconColor},
                                ]}
                            />
                        )}
                    </StyleTouchable>
                    <View style={styles.textLikeCommentBox}>
                        {!!totalLikes && (
                            <StyleText
                                originValue={totalLikes}
                                customStyle={[
                                    styles.textLikeComment,
                                    {color: theme.unLikeHeart},
                                ]}
                            />
                        )}
                    </View>
                </View>
            );
        };

        const RenderComment = () => {
            return (
                <View>
                    <StyleTouchable
                        customStyle={[styles.buttonTouch, {backgroundColor}]}
                        onPress={() => onShowModalComment(item)}
                        hitSlop={15}>
                        <StyleImage
                            source={Images.icons.comment}
                            customStyle={styles.iconComment}
                        />
                    </StyleTouchable>

                    <View style={styles.textLikeCommentBox}>
                        {!!item.totalComments && (
                            <StyleText
                                originValue={item.totalComments}
                                customStyle={[
                                    styles.textLikeComment,
                                    {color: theme.unLikeHeart},
                                ]}
                            />
                        )}
                    </View>
                </View>
            );
        };

        const RenderReload = () => {
            return (
                <StyleTouchable
                    customStyle={[styles.buttonTouch, {backgroundColor}]}
                    onPress={() => onRefreshItem(item.id)}
                    hitSlop={{left: 10, top: 10, right: 10, bottom: 10}}>
                    <StyleImage
                        source={Images.icons.reload}
                        customStyle={styles.iconReload}
                    />
                </StyleTouchable>
            );
        };

        return (
            <View style={styles.toolView}>
                {RenderStartChat()}
                {RenderIconLikeUnLike()}
                {RenderComment()}
                {RenderReload()}
            </View>
        );
    };

    return (
        <LinearGradient
            style={styles.container}
            colors={color}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View
                style={[styles.body, {backgroundColor: theme.backgroundColor}]}>
                {RenderImage()}
                {RenderContentName()}
                {RenderTool()}
            </View>
        </LinearGradient>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: bubbleProfileWidth(),
        height: bubbleProfileHeight(),
        padding: '15@ms',
        overflow: 'hidden',
    },
    body: {
        flex: 1,
        borderRadius: '15@ms',
    },
    // avatar, name and content
    avatarNameContentView: {
        width: '100%',
        paddingHorizontal: '10@s',
        paddingVertical: '10@ms', // 00
        borderRadius: '15@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: '35@ms',
        height: '35@ms',
        borderRadius: '20@ms',
    },
    contentBox: {
        flex: 1,
        paddingLeft: '10@s',
    },
    textName: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    textContent: {
        fontSize: '17@ms',
        color: Theme.common.white,
    },
    // image
    imageView: {
        flex: 1,
        backgroundColor: Theme.darkTheme.backgroundColor,
        borderRadius: '15@ms',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
    },
    moreTouch: {
        position: 'absolute',
        right: '8@s',
        top: '15@ms',
    },
    iconMore: {
        width: '30@ms',
        height: '10@ms',
    },
    iconHobby: {
        position: 'absolute',
        marginTop: 0,
        top: '10@ms',
        left: '10@ms',
    },
    // tool
    toolView: {
        position: 'absolute',
        bottom: 0,
        width: '95%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        alignSelf: 'center',
        height: '75@ms',
    },
    buttonTouch: {
        width: '45@ms',
        height: '45@ms',
        borderWidth: '0@ms',
        borderRadius: '40@ms',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.common.white,
    },
    iconChatNow: {
        width: '35@ms',
        height: '35@ms',
    },
    iconLike: {
        fontSize: '25@ms',
    },
    iconUnLike: {
        fontSize: '25@ms',
    },
    textLikeCommentBox: {
        marginTop: '7@vs',
        alignSelf: 'center',
    },
    textLikeComment: {
        fontSize: '12@ms',
    },
    commentBox: {},
    iconComment: {
        width: '30@ms',
        height: '30@ms',
    },
    iconReload: {
        width: '30@ms',
        height: '30@ms',
    },
    iconReport: {
        fontSize: '18@ms',
    },
    reportBox: {
        position: 'absolute',
        right: '60@ms',
        top: '60@ms',
    },
    // linear gradient
    linearGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderBottomLeftRadius: '15@ms',
        borderBottomRightRadius: '15@ms',
        paddingBottom: '85@ms',
        paddingTop: '40@ms',
    },
});

export default memo(BubbleProfile, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    return true;
});
