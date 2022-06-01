import {TypeBubblePalace} from 'api/interface';
import {apiGetDetailBubble, apiLikePost, apiUnLikePost} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import AutoHeightImage from 'components/AutoHeightImage';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleActionSheet from 'components/common/StyleActionSheet';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    goBack,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {
    bubbleProfileHeight,
    bubbleProfileWidth,
    chooseColorGradient,
    choosePrivateAvatar,
    logger,
} from 'utility/assistant';
import IconHobby from './components/IconHobby';
import ModalComment from './components/ModalComment';

interface Props {
    route: {
        params: {
            bubbleId?: string;
            itemBubble?: TypeBubblePalace;
            displayComment?: boolean;
        };
    };
}

const DetailBubble = ({route}: Props) => {
    const bubbleId = route.params?.bubbleId;
    const itemBubble = route.params?.itemBubble;
    const routeDisplayComment = !!route.params?.displayComment;

    const theme = Redux.getTheme();
    const {gradient} = Redux.getResource();

    const optionsRef = useRef<any>(null);

    const [bubble, setBubble] = useState<TypeBubblePalace>();
    const [displayComment, setDisplayComment] = useState(routeDisplayComment);

    const isLiked = bubble?.isLiked;
    const totalLikes = bubble?.totalLikes;
    const avatar =
        bubble?.creatorAvatar ||
        (bubble?.gender ? choosePrivateAvatar(bubble.gender) : '');

    const color = chooseColorGradient({
        listGradients: gradient,
        colorChoose: bubble?.color || 0,
    });

    const imageChoose = bubble?.images[0] ? bubble?.images[0] : avatar;

    const getData = async () => {
        try {
            if (bubbleId) {
                const res = await apiGetDetailBubble(bubbleId);
                setBubble(res.data);
            } else if (bubble) {
                setBubble(itemBubble);
            }
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onGoToProfile = () => {
        if (bubble?.hadKnowEachOther) {
            navigate(ROOT_SCREEN.otherProfile, {
                id: bubble.creatorId,
            });
        }
    };

    const onShowMoreOption = () => {
        optionsRef.current?.show();
    };

    const onRefreshItem = async () => {
        try {
            if (bubble?.id) {
                const res = await apiGetDetailBubble(bubble.id);
                setBubble(res.data);
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onLikeUnLike = async () => {
        if (bubble && totalLikes !== undefined && isLiked !== undefined) {
            const currentLike = isLiked;
            const currentTotalLikes = totalLikes;

            try {
                setBubble({
                    ...bubble,
                    isLiked: !currentLike,
                    totalLikes: currentTotalLikes + (isLiked ? -1 : 1),
                });
                await (currentLike
                    ? apiUnLikePost(bubble.id)
                    : apiLikePost(bubble.id));
            } catch (err) {
                setBubble({
                    ...bubble,
                    isLiked: currentLike,
                    totalLikes: currentTotalLikes,
                });
                appAlert(err);
            }
        }
    };

    const onShowModalComment = () => {
        setDisplayComment(true);
    };

    /**
     * Render view
     */
    const RenderImage = () => {
        const opacity = bubble?.images[0] ? 1 : 0.3;

        const onShowNameBubble = () => {
            logger(bubble?.name);
        };

        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onDoubleClick={() => {
                    if (!isLiked) {
                        onLikeUnLike();
                    } else {
                        showSwipeImages({
                            listImages: [{url: imageChoose}],
                        });
                    }
                }}>
                <AutoHeightImage
                    uri={imageChoose}
                    customStyle={[styles.image, {opacity}]}
                />

                <StyleTouchable
                    customStyle={styles.moreTouch}
                    onPress={onShowMoreOption}
                    hitSlop={15}>
                    <StyleImage
                        source={Images.icons.more}
                        customStyle={styles.iconMore}
                        resizeMode="contain"
                    />
                </StyleTouchable>

                {bubble?.color && (
                    <IconHobby
                        bubbleId={bubble?.id}
                        color={bubble.color}
                        containerStyle={styles.iconHobby}
                        onTouchStart={onShowNameBubble}
                    />
                )}
            </StyleTouchHaveDouble>
        );
    };

    const RenderContentName = () => {
        const textColor =
            bubble?.relationship === RELATIONSHIP.self
                ? theme.highlightColor
                : Theme.darkTheme.textHightLight;
        return (
            <LinearGradient
                colors={['transparent', Theme.darkTheme.backgroundColor]}
                style={styles.linearGradient}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}>
                <View style={styles.avatarNameContentView}>
                    <StyleTouchable onPress={onGoToProfile}>
                        <StyleImage
                            source={{uri: avatar}}
                            customStyle={styles.avatar}
                        />
                    </StyleTouchable>

                    <View style={styles.contentBox}>
                        <StyleText
                            originValue={`${bubble?.creatorName}`}
                            customStyle={[styles.textName, {color: textColor}]}
                            onPress={onGoToProfile}
                        />
                        <StyleMoreText
                            value={bubble?.content}
                            textStyle={[
                                styles.textContent,
                                {color: Theme.darkTheme.textHightLight},
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
                        onPress={onShowModalComment}
                        hitSlop={15}>
                        <StyleImage
                            source={Images.icons.comment}
                            customStyle={styles.iconComment}
                        />
                    </StyleTouchable>

                    <View style={styles.textLikeCommentBox}>
                        {!!bubble?.totalComments && (
                            <StyleText
                                originValue={bubble?.totalComments}
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
                    onPress={onRefreshItem}
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
        <>
            <LinearGradient
                style={styles.container}
                colors={color}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <View
                    style={[
                        styles.body,
                        {backgroundColor: theme.backgroundColor},
                    ]}>
                    {RenderImage()}
                    {RenderContentName()}
                    {RenderTool()}
                </View>
            </LinearGradient>

            <HeaderLeftIcon onPress={goBack} style={styles.backIcon} />

            {!!bubble && displayComment && (
                <ModalComment
                    bubbleFocusing={bubble}
                    setBubbleFocusing={setBubble}
                    displayComment={displayComment}
                    setDisplayComment={setDisplayComment}
                    isNotModalOfMainTab
                />
            )}

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: 'discovery.report.title',
                        action: () => {
                            if (bubble?.creatorId) {
                                navigate(ROOT_SCREEN.reportUser, {
                                    idUser: bubble?.creatorId,
                                });
                            }
                        },
                    },
                    {
                        text: 'discovery.seeDetailImage',
                        action: () => {
                            showSwipeImages({
                                listImages: [{url: imageChoose}],
                            });
                        },
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />
        </>
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
    backIcon: {
        position: 'absolute',
        top: '100@vs',
        backgroundColor: `rgba(8, 16, 25, ${0.4})`,
        borderRadius: '20@vs',
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

export default DetailBubble;
