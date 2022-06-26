/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-expressions */
import {TypeBubblePalace} from 'api/interface';
import {apiLikePost, apiUnLikePost} from 'api/module';
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
import Redux from 'hook/useRedux';
import {appAlert, goBack} from 'navigation/NavigationService';
import React, {memo, useEffect, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    moderateScale,
    scale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import {
    chooseColorGradient,
    choosePrivateAvatar,
    logger,
    onGoToSignUp,
} from 'utility/assistant';
import {Modalize} from 'react-native-modalize';
import {TypeShowMoreOptions} from '../ListBubbleCouple';
import IconHobby from './IconHobby';

interface Props {
    item: TypeBubblePalace;
    onInteractBubble(idBubble: TypeBubblePalace): void;
    onShowMoreOption(params: TypeShowMoreOptions): void;
    onRefreshItem(idBubble: string): Promise<void>;
    onGoToProfile(item: TypeBubblePalace): void;
    onShowModalComment(): void;
    onSeeDetailImage(url: string, allowSave: boolean): void;
}

const bubbleWidth =
    Metrics.width - Metrics.safeLeftPadding - Metrics.safeRightPadding;
export const bubbleHeight =
    Metrics.height -
    Metrics.contentSafeTop -
    Metrics.safeBottomPadding -
    moderateScale(60);

const Bubble = (props: Props) => {
    const {
        item,
        onInteractBubble,
        onShowMoreOption,
        onRefreshItem,
        onGoToProfile,
        onShowModalComment,
        onSeeDetailImage,
    } = props;

    const isModeExp = Redux.getModeExp();
    const {gradient} = Redux.getResource();
    const theme = Redux.getTheme();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);

    const avatar = item.creatorAvatar || choosePrivateAvatar(item.gender);
    const color = chooseColorGradient({
        listGradients: gradient,
        colorChoose: item.color,
    });
    const isMyBubble = item.relationship === RELATIONSHIP.self;
    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

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
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
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
                        onSeeDetailImage(imageChoose, isMyBubble);
                    }
                }}>
                <AutoHeightImage
                    uri={imageChoose}
                    customStyle={[styles.image, {opacity}]}
                />

                <StyleTouchable
                    customStyle={styles.moreTouch}
                    onPress={() =>
                        onShowMoreOption({
                            idUser: item.creatorId,
                            imageWantToSee: imageChoose,
                            allowSaveImage: false,
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
        const textColor = isMyBubble
            ? theme.highlightColor
            : Theme.darkTheme.textHightLight;
        return (
            <LinearGradient
                colors={['transparent', Theme.darkTheme.backgroundColor]}
                style={styles.linearGradient}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}>
                <View style={styles.avatarNameContentView}>
                    <StyleTouchable onPress={() => onGoToProfile(item)}>
                        <StyleImage
                            source={{uri: avatar}}
                            customStyle={styles.avatar}
                        />
                    </StyleTouchable>

                    <View style={styles.contentBox}>
                        <StyleText
                            originValue={`@${item.creatorName}`}
                            customStyle={[styles.textName, {color: textColor}]}
                            onPress={() => onGoToProfile(item)}
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
        const {backgroundColor} = theme;

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
                    onPress={() => onInteractBubble(item)}>
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
                        onPress={onShowModalComment}
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
                    onPress={() => onOpen()}
                    hitSlop={{left: 10, top: 10, right: 10, bottom: 10}}>
                    <StyleImage
                        source={Images.icons.share}
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

    const RenderModalShare = () => {
        const activityShare = [
            {
                id: 0,
                url: Images.icons.facebookLink,
                width: scale(50),
                height: scale(50),
                title: 'Facebook',
            },
            {
                id: 1,
                url: Images.icons.messageLink,
                width: scale(50),
                height: scale(50),
                title: 'Message',
            },
            {
                id: 2,
                url: Images.icons.zaloLink,
                width: scale(50),
                height: scale(50),
                title: 'Zalo',
            },
        ];
        return (
            <View style={styles.wrapViewModalShare}>
                <View style={styles.wrapViewHeaderModal}>
                    <View style={styles.wrapViewIconShare} />
                    <View>
                        <StyleText
                            i18Text="Have a pocketsized avocado"
                            customStyle={styles.wrapTextTitleModal}
                        />
                        <StyleText
                            i18Text="pocketsizedavocado.com"
                            customStyle={styles.wrapTextContentModal}
                        />
                    </View>
                    <StyleTouchable
                        onPress={() => modalizeRef.current?.close()}
                        customStyle={styles.wrapTouchCloseModal}>
                        <StyleImage
                            source={Images.icons.close}
                            customStyle={styles.wrapIconClose}
                        />
                    </StyleTouchable>
                </View>
                <View style={styles.wrapViewBodyModal}>
                    <StyleTouchable onPress={() => null}>
                        <StyleImage
                            source={Images.icons.shareLink}
                            customStyle={styles.wrapIconActivityShare}
                        />
                    </StyleTouchable>
                    <StyleTouchable onPress={() => null}>
                        <StyleImage
                            source={Images.icons.copyLink}
                            customStyle={styles.wrapIconActivityShare}
                        />
                    </StyleTouchable>
                </View>
                <View style={styles.wrapViewBodyModalLink}>
                    {activityShare.map((item: any) => {
                        return (
                            <StyleTouchable
                                style={styles.wrapViewShare}
                                onPress={() => null}>
                                <StyleImage
                                    source={item.url}
                                    customStyle={{
                                        width: item.width,
                                        height: item.height,
                                    }}
                                />
                                <StyleText
                                    i18Text={item.title}
                                    customStyle={styles.wrapTextTitleShare}
                                />
                            </StyleTouchable>
                        );
                    })}
                </View>
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
            <Modalize
                ref={modalizeRef}
                modalHeight={verticalScale(280)}
                withHandle={false}
                rootStyle={[styles.wrapModal]}>
                {RenderModalShare()}
            </Modalize>
        </LinearGradient>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: bubbleWidth,
        height: bubbleHeight,
        padding: '15@ms',
        overflow: 'hidden',
    },
    body: {
        flex: 1,
        borderRadius: '15@ms',
    },
    // avatar, name and content
    linearGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderBottomLeftRadius: '15@ms',
        borderBottomRightRadius: '15@ms',
        paddingBottom: '85@ms',
        paddingTop: '40@ms',
    },
    avatarNameContentView: {
        width: '100%',
        paddingHorizontal: '10@s',
        paddingTop: '10@ms', // 00
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
        fontSize: '16@ms',
        fontWeight: 'bold',
    },
    textContent: {
        fontSize: '13@ms',
        color: Theme.common.white,
        marginTop: '4@ms',
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
        width: '20@ms',
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
        width: '28@ms',
        height: '28@ms',
    },
    iconReload: {
        width: '36@ms',
        height: '36@ms',
    },
    iconReport: {
        fontSize: '18@ms',
    },
    reportBox: {
        position: 'absolute',
        right: '60@ms',
        top: '60@ms',
    },
    wrapModal: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    wrapViewModalShare: {
        height: '100%',
    },
    wrapViewHeaderModal: {
        flexDirection: 'row',
        padding: '16@vs',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Theme.common.textMe,
    },
    wrapViewIconShare: {
        width: '41@s',
        height: '41@s',
        backgroundColor: Theme.common.blueInput,
        borderRadius: 5,
        marginRight: '8@s',
    },
    wrapTextTitleModal: {
        fontWeight: '700',
        fontSize: '15@ms0.3',
        color: Theme.common.black,
        marginBottom: '2@vs',
    },
    wrapTextContentModal: {
        fontWeight: '400',
        fontSize: '13@ms0.3',
        color: Theme.common.gray,
    },
    wrapTouchCloseModal: {
        position: 'absolute',
        top: '10@vs',
        right: '10@s',
    },
    wrapIconClose: {
        width: '28@s',
        height: '28@s',
    },
    wrapViewBodyModal: {
        flexDirection: 'row',
        paddingVertical: '30@vs',
        paddingHorizontal: '18@s',
        borderBottomWidth: 1,
        borderBottomColor: Theme.common.textMe,
    },
    wrapViewBodyModalLink: {
        flexDirection: 'row',
        padding: '16@vs',
        alignItems: 'center',
    },
    wrapIconActivityShare: {
        width: '50@s',
        height: '50@s',
        marginRight: '29@s',
    },
    wrapViewShare: {
        marginRight: '39@s',
        alignItems: 'center',
    },
    wrapTextTitleShare: {
        fontSize: '14@ms0.3',
        fontWeight: '500',
        color: Theme.common.black,
        marginTop: '5@vs',
    },
});

export default memo(Bubble, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    return true;
});
