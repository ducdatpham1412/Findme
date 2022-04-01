import {TypeBubblePalace} from 'api/interface';
import {apiGetDetailBubble, apiLikePost, apiUnLikePost} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {choosePrivateAvatar} from 'utility/assistant';
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

const bubbleWidth =
    Metrics.width - Metrics.safeLeftPadding - Metrics.safeRightPadding;
const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const DetailBubble = ({route}: Props) => {
    const bubbleId = route.params?.bubbleId;
    const itemBubble = route.params?.itemBubble;
    const routeDisplayComment = !!route.params?.displayComment;

    const theme = Redux.getTheme();

    const [bubble, setBubble] = useState<TypeBubblePalace>();
    const [displayLayer, setDisplayLayer] = useState(false);
    const [displayComment, setDisplayComment] = useState(routeDisplayComment);

    const isLiked = bubble?.isLiked;
    const totalLikes = bubble?.totalLikes;
    const avatar =
        bubble?.creatorAvatar ||
        (bubble?.gender ? choosePrivateAvatar(bubble.gender) : '');

    const getData = async () => {
        try {
            if (bubbleId) {
                const res = await apiGetDetailBubble(bubbleId);
                setBubble(res.data);
            } else if (itemBubble) {
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

    const onReportUser = () => {
        if (bubble?.creatorId) {
            navigate(ROOT_SCREEN.reportUser, {
                idUser: bubble.creatorId,
            });
        }
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
        if (bubble && totalLikes && isLiked !== undefined) {
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
        const imageChoose = bubble?.images[0] ? bubble.images[0] : avatar;
        const opacity = bubble?.images[0] ? 1 : 0.3;
        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onDoubleClick={() => {
                    if (!isLiked) {
                        // onLikeUnLike();
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
            bubble?.relationship === RELATIONSHIP.self
                ? theme.highlightColor
                : theme.textHightLight;
        return (
            <View style={styles.avatarNameContentView}>
                <HeaderLeftIcon onPress={goBack} />
                <View style={styles.avatarNameBox}>
                    <StyleText
                        originValue={`@${bubble?.creatorName || ''}`}
                        customStyle={[styles.textName, {color}]}
                        onPress={onGoToProfile}
                    />
                </View>
                <View style={styles.contentBox}>
                    <StyleText
                        originValue={`🌙  ${bubble?.name || ''}`}
                        customStyle={[
                            styles.textNameBubble,
                            {color: theme.textHightLight},
                        ]}
                    />
                    <StyleMoreText
                        value={bubble?.content}
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
                    onPress={onReportUser}>
                    <Feather
                        name="flag"
                        style={[styles.iconReport, {color: theme.textColor}]}
                    />
                </StyleTouchable>
                <StyleTouchable
                    customStyle={styles.iconReportTouch}
                    onPress={onRefreshItem}>
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
            <StyleTouchable onPress={onGoToProfile}>
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
                    {!!bubble?.totalComments && (
                        <StyleText
                            originValue={bubble.totalComments}
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
        if (bubble?.id === undefined || bubble?.color === undefined) {
            return null;
        }
        return (
            <IconHobby
                bubbleId={bubble?.id}
                color={bubble?.color}
                onTouchStart={() => setDisplayLayer(true)}
                onTouchEnd={() => setDisplayLayer(false)}
            />
        );
    };

    return (
        <>
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
            </View>

            {!!bubble && displayComment && (
                <ModalComment
                    bubbleFocusing={bubble}
                    displayComment={displayComment}
                    setDisplayComment={setDisplayComment}
                    isNotModalOfMainTab
                />
            )}
        </>
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
        bottom: '200@s',
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
        top: '10@vs',
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
        top: '5@vs',
        left: '10@s',
        width: '70%',
    },
    avatarNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
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

export default DetailBubble;
