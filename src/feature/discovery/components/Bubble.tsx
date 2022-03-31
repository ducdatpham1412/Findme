import {TypeBubblePalace} from 'api/interface';
import {apiLikePost, apiUnLikePost} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    chooseColorGradient,
    choosePrivateAvatar,
    onGoToSignUp,
} from 'utility/assistant';
import IconHobby from './IconHobby';

interface Props {
    item: TypeBubblePalace;
    onInteractBubble(idBubble: TypeBubblePalace): void;
    onReportUser(idUser: number): void;
    onRefreshItem(idBubble: string): Promise<void>;
    onGoToProfile(item: TypeBubblePalace): void;
    onShowModalComment(): void;
}

const bubbleWidth =
    Metrics.width - Metrics.safeLeftPadding - Metrics.safeRightPadding;
const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const Bubble = (props: Props) => {
    const {
        item,
        onInteractBubble,
        onReportUser,
        onRefreshItem,
        onGoToProfile,
        onShowModalComment,
    } = props;

    const isModeExp = Redux.getModeExp();
    const {gradient} = Redux.getResource();
    const theme = Redux.getTheme();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);

    const [displayLayer, setDisplayLayer] = useState(false);

    const avatar = item.creatorAvatar || choosePrivateAvatar(item.gender);

    const onLikeUnLike = async () => {
        if (!isModeExp) {
            const currentLike = isLiked;
            const currentNumberLikes = totalLikes;
            try {
                setIsLiked(!currentLike);
                setTotalLikes(currentNumberLikes + (currentLike ? -1 : 1));
                currentLike
                    ? await apiUnLikePost(item.id)
                    : await apiLikePost(item.id);
            } catch (err) {
                setIsLiked(currentLike);
                setTotalLikes(currentNumberLikes);
                appAlert(err);
            }
        } else {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: onGoToSignUp,
            });
        }
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
        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onDoubleClick={() => {
                    if (!isLiked) {
                        onLikeUnLike();
                    }
                }}>
                <StyleImage
                    source={{uri: imageChoose}}
                    customStyle={[styles.image, {opacity}]}
                />
            </StyleTouchHaveDouble>
        );
    };

    const RenderLayer = () => {
        if (!displayLayer) {
            return null;
        }
        return (
            <View
                style={[
                    styles.layerView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    };

    const RenderNameAndContent = () => {
        const color =
            item.relationship === RELATIONSHIP.self
                ? theme.highlightColor
                : theme.textHightLight;
        return (
            <View style={styles.avatarNameContentView}>
                <View style={styles.avatarNameBox}>
                    <StyleText
                        originValue={`@${item.creatorName}`}
                        customStyle={[styles.textName, {color}]}
                        onPress={() => onGoToProfile(item)}
                    />
                </View>
                <View style={styles.contentBox}>
                    <StyleText
                        originValue={`🌙  ${item.name}`}
                        customStyle={[
                            styles.textNameBubble,
                            {color: theme.textHightLight},
                        ]}
                    />
                    <StyleMoreText
                        value={item.content}
                        textStyle={[
                            styles.textContent,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>
            </View>
        );
    };

    const RenderExtensionTool = () => {
        return (
            <View style={styles.reportView}>
                <StyleTouchable
                    customStyle={styles.iconReportTouch}
                    onPress={() => onReportUser(item.creatorId)}>
                    <Feather
                        name="flag"
                        style={[styles.iconReport, {color: theme.textColor}]}
                    />
                </StyleTouchable>
                <StyleTouchable
                    customStyle={styles.iconReportTouch}
                    onPress={() => onRefreshItem(item.id)}>
                    <Feather
                        name="refresh-ccw"
                        style={[styles.iconReport, {color: theme.textColor}]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    const RenderAvatar = () => {
        return (
            <StyleTouchable onPress={() => onGoToProfile(item)}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatar}
                />
            </StyleTouchable>
        );
    };

    const RenderIconLikeUnLike = () => {
        const color = isLiked ? Theme.common.pink : theme.unLikeHeart;
        return (
            <View style={styles.likeBox}>
                {isLiked ? (
                    <IconLiked
                        onPress={onLikeUnLike}
                        customStyle={styles.iconLike}
                    />
                ) : (
                    <IconNotLiked
                        onPress={onLikeUnLike}
                        customStyle={[styles.iconUnLike, {color}]}
                    />
                )}

                <View style={styles.textLikeCommentBox}>
                    {!!totalLikes && (
                        <StyleText
                            originValue={totalLikes}
                            customStyle={[styles.textLikeComment, {color}]}
                        />
                    )}
                </View>
            </View>
        );
    };

    const RenderComment = () => {
        return (
            <StyleTouchable
                customStyle={styles.commentBox}
                onPress={onShowModalComment}>
                <FontAwesome
                    name="comments-o"
                    style={[styles.iconComment, {color: theme.unLikeHeart}]}
                />
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
            </StyleTouchable>
        );
    };

    const RenderIconHobby = () => {
        return (
            <IconHobby
                bubbleId={item.id}
                color={item.color}
                onTouchStart={() => setDisplayLayer(true)}
                onTouchEnd={() => setDisplayLayer(false)}
            />
        );
    };

    const RenderStartChat = () => {
        if (item.hadKnowEachOther) {
            return null;
        }
        const color = chooseColorGradient({
            listGradients: gradient,
            colorChoose: item.color,
        });
        return (
            <LinearGradient
                style={styles.linearGradient}
                colors={color}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <StyleTouchable
                    customStyle={styles.touchStartChat}
                    onPress={() => onInteractBubble(item)}>
                    <StyleText
                        i18Text="discovery.bubble.startChat"
                        customStyle={[
                            styles.textStart,
                            {color: Theme.common.white},
                        ]}
                    />
                </StyleTouchable>
            </LinearGradient>
        );
    };

    return (
        <View style={styles.itemBubbleView}>
            {RenderImage()}
            {RenderLayer()}
            {RenderNameAndContent()}
            {RenderExtensionTool()}
            <View style={styles.toolView}>
                {RenderAvatar()}
                {RenderIconLikeUnLike()}
                {RenderComment()}
                {RenderIconHobby()}
            </View>
            {RenderStartChat()}
        </View>
    );
};

const styles = ScaledSheet.create({
    itemBubbleView: {
        width: bubbleWidth,
        height: bubbleHeight,
    },
    // image
    imageView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    // layer
    layerView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    // tool
    toolView: {
        position: 'absolute',
        width: '66@s',
        paddingVertical: '10@vs',
        bottom: '150@s',
        right: 0,
        alignItems: 'center',
    },
    avatar: {
        width: '45@ms',
        height: '45@ms',
        borderRadius: '30@ms',
    },
    likeBox: {
        width: '100%',
        height: '70@vs',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '40@vs',
    },
    iconLike: {
        fontSize: '40@ms',
    },
    iconUnLike: {
        fontSize: '40@ms',
    },
    textLikeCommentBox: {
        height: '30@ms',
        marginTop: '7@vs',
        alignSelf: 'center',
    },
    textLikeComment: {
        fontSize: '20@ms',
    },
    commentBox: {
        marginTop: '20@vs',
    },
    iconComment: {
        fontSize: '40@ms',
    },
    // gradient
    linearGradient: {
        height: '40@s',
        position: 'absolute',
        alignSelf: 'center',
        bottom: '100@vs',
        borderRadius: '50@s',
    },
    touchStartChat: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '50@s',
    },
    textStart: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    // report
    reportView: {
        position: 'absolute',
        width: '50@ms',
        top: Metrics.safeTopPadding + verticalScale(10),
        right: '10@s',
        alignItems: 'center',
        borderRadius: '30@ms',
    },
    iconReportTouch: {
        marginBottom: '30@vs',
    },
    iconReport: {
        fontSize: '25@ms',
    },
    reportBox: {
        position: 'absolute',
        right: '60@ms',
        top: '60@ms',
    },
    // avatar, name and content
    avatarNameContentView: {
        position: 'absolute',
        top: Metrics.safeTopPadding + verticalScale(10),
        left: '10@s',
        width: '70%',
    },
    avatarNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textName: {
        fontSize: '16@ms',
        fontWeight: 'bold',
    },
    contentBox: {
        width: '100%',
        paddingTop: '7@vs',
    },
    textNameBubble: {
        fontSize: '15@ms',
        marginBottom: '10@vs',
    },
    textContent: {
        fontSize: '14@ms',
        color: Theme.common.white,
    },
});

export default memo(Bubble, (preProps: Props, nextProps: any) => {
    for (const [key, value] of Object.entries(preProps)) {
        if (nextProps?.[key] !== value) {
            return false;
        }
    }
    return true;
});
