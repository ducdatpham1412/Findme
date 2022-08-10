import {TypeBubblePalace} from 'api/interface';
import {apiGetDetailBubble, apiLikePost, apiUnLikePost} from 'api/module';
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
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {bubbleProfileHeight, bubbleProfileWidth} from 'utility/assistant';
import ModalComment from './components/ModalComment';

interface Props {
    route: {
        params: {
            bubbleId: string;
            displayComment?: boolean;
        };
    };
}

const DetailBubble = ({route}: Props) => {
    const bubbleId = route.params?.bubbleId;
    const routeDisplayComment = !!route.params?.displayComment;

    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile.id;

    const optionsRef = useRef<any>(null);

    const [bubble, setBubble] = useState<TypeBubblePalace>();
    const [displayComment, setDisplayComment] = useState(routeDisplayComment);

    const imageChoose = bubble?.images[0] || bubble?.creatorAvatar || '';
    const isMyPost = bubble?.creator === myId;

    const getData = async () => {
        try {
            const res = await apiGetDetailBubble(bubbleId);
            setBubble(res.data);
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onGoToProfile = () => {
        if (bubble?.creator) {
            navigate(ROOT_SCREEN.otherProfile, {
                id: bubble.creator,
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

    const onHandleLike = async () => {
        if (bubble) {
            const currentLike = bubble.isLiked;
            const currentTotalLikes = bubble.totalLikes;

            try {
                setBubble({
                    ...bubble,
                    isLiked: !currentLike,
                    totalLikes: currentTotalLikes + (currentLike ? -1 : 1),
                });
                if (currentLike) {
                    await apiUnLikePost(bubble.id);
                } else {
                    apiLikePost(bubble.id);
                }
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

        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onDoubleClick={() => {
                    if (!bubble?.isLiked) {
                        onHandleLike();
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
            </StyleTouchHaveDouble>
        );
    };

    const RenderContentName = () => {
        if (!bubble) {
            return null;
        }

        const textColor = isMyPost
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
                            source={{uri: bubble.creatorAvatar}}
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
        const StartChat = () => {
            return (
                <StyleTouchable
                    customStyle={[
                        styles.buttonTouch,
                        {
                            width: moderateScale(55),
                            height: moderateScale(55),
                            backgroundColor: theme.backgroundColor,
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

        const IconLike = () => {
            return (
                <View>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonTouch,
                            {backgroundColor: theme.backgroundColor},
                        ]}
                        onPress={onHandleLike}
                        hitSlop={15}>
                        {bubble?.isLiked ? (
                            <IconLiked
                                onPress={onHandleLike}
                                customStyle={[
                                    styles.iconLike,
                                    {color: theme.likeHeart},
                                ]}
                            />
                        ) : (
                            <IconNotLiked
                                onPress={onHandleLike}
                                customStyle={[
                                    styles.iconUnLike,
                                    {color: theme.unLikeHeart},
                                ]}
                            />
                        )}
                    </StyleTouchable>
                    <View style={styles.textLikeCommentBox}>
                        {!!bubble?.totalLikes && (
                            <StyleText
                                originValue={bubble.totalLikes}
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

        const Comment = () => {
            return (
                <View>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonTouch,
                            {backgroundColor: theme.backgroundColor},
                        ]}
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

        const Reload = () => {
            return (
                <StyleTouchable
                    customStyle={[
                        styles.buttonTouch,
                        {backgroundColor: theme.backgroundColor},
                    ]}
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
                {StartChat()}
                {IconLike()}
                {Comment()}
                {Reload()}
            </View>
        );
    };

    const ModalOptions = () => {
        if (!isMyPost) {
            return (
                <StyleActionSheet
                    ref={optionsRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.report.title',
                            action: () => {
                                if (bubble?.creator) {
                                    navigate(ROOT_SCREEN.reportUser, {
                                        idUser: bubble.creator,
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
            );
        }

        return null; // Tomorrow check here
    };

    return (
        <>
            <View style={styles.container}>
                <View
                    style={[
                        styles.body,
                        {backgroundColor: theme.backgroundColor},
                    ]}>
                    {RenderImage()}
                    {RenderContentName()}
                    {RenderTool()}
                </View>
            </View>

            {!!bubble && displayComment && (
                <ModalComment
                    bubbleFocusing={bubble}
                    setBubbleFocusing={setBubble}
                    displayComment={displayComment}
                    setDisplayComment={setDisplayComment}
                    isNotModalOfMainTab
                />
            )}

            {ModalOptions()}
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
        width: '25@ms',
        height: '8@ms',
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
