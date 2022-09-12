import {TypeBubblePalace} from 'api/interface';
import {
    apiLikePost,
    apiSavePost,
    apiUnArchivePost,
    apiUnLikePost,
    apiUnSavePost,
} from 'api/post';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import VideoBubble from 'components/common/VideoBubble';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {memo, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {Linking, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseIconFeeling,
    chooseTextTopic,
    logger,
    onGoToProfile,
    onGoToSignUp,
} from 'utility/assistant';
import {formatFromNow} from 'utility/format';
import {checkIsVideo} from 'utility/validate';
import Share from 'react-native-share';
import {TYPE_BUBBLE_PALACE_ACTION, TYPE_DYNAMIC_LINK} from 'asset/enum';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    LANDING_PAGE_URL,
} from 'asset/standardValue';
import {TypeMoreOptionsMe, TypeShowMoreOptions} from '../DiscoveryScreen';

interface Props {
    item: TypeBubblePalace;
    onShowMoreOption(params: TypeShowMoreOptions & TypeMoreOptionsMe): void;
    onShowModalComment(post: TypeBubblePalace, type: 'comment' | 'like'): void;
    isFocusing: boolean;
    onChangePostIdFocusing(postId: string): void;
}

const onHandleLike = async (params: {
    isModeExp: boolean;
    isLiked: boolean;
    setIsLiked: Function;
    totalLikes: number;
    setTotalLikes: Function;
    postId: string;
}) => {
    const {isModeExp, isLiked, setIsLiked, totalLikes, setTotalLikes, postId} =
        params;

    if (!isModeExp) {
        const currentLike = isLiked;
        const currentNumberLikes = totalLikes;
        try {
            setIsLiked(!currentLike);
            setTotalLikes(currentNumberLikes + (currentLike ? -1 : 1));
            if (currentLike) {
                await apiUnLikePost(postId);
            } else {
                await apiLikePost(postId);
            }
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

const onHandleSave = async (params: {
    isModeExp: boolean;
    isSaved: boolean;
    setIsSaved: Function;
    postId: string;
}) => {
    const {isModeExp, isSaved, setIsSaved, postId} = params;
    if (!isModeExp) {
        const currenSaved = isSaved;
        try {
            setIsSaved(!currenSaved);
            if (currenSaved) {
                await apiUnSavePost(postId);
            } else {
                await apiSavePost(postId);
            }
        } catch (err) {
            setIsSaved(currenSaved);
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

const onGoToPublicDraft = (item: TypeBubblePalace) => {
    navigate(PROFILE_ROUTE.createPostPreview, {
        itemDraft: item,
    });
};

const onUnArchivePost = async (post: TypeBubblePalace) => {
    try {
        await apiUnArchivePost(post.id);
        Redux.setBubblePalaceAction({
            action: TYPE_BUBBLE_PALACE_ACTION.unArchivePost,
            payload: {
                ...post,
                isArchived: false,
            },
        });
    } catch (err) {
        appAlert(err);
    }
};

const onOpenLink = (link: string) => {
    try {
        Linking.openURL(link);
    } catch (err) {
        logger(err);
    }
};

const onShowModalShare = async (
    item: TypeBubblePalace,
    setDisableShare: Function,
) => {
    try {
        setDisableShare(true);
        const link = await dynamicLinks().buildShortLink({
            link: `${item?.images?.[0] || LANDING_PAGE_URL}?type=${
                TYPE_DYNAMIC_LINK.post
            }&post_id=${item.id}`,
            domainUriPrefix: DYNAMIC_LINK_SHARE,
            ios: {
                bundleId: DYNAMIC_LINK_IOS,
                appStoreId: '570060128',
            },
            android: {
                packageName: DYNAMIC_LINK_ANDROID,
                fallbackUrl: ANDROID_APP_LINK,
            },
            analytics: {
                campaign: 'banner',
            },
        });

        // const imagePath: any = null;
        // let base64Data = '';
        // if (isIOS) {
        //     const resp = await RNFetchBlob.config({
        //         fileCache: true,
        //     }).fetch('GET', item.images[0]);
        //     base64Data = await resp.readFile('base64');
        // } else {
        //     base64Data = await RNFetchBlob.fs.readFile(
        //         item.images[0],
        //         'base64',
        //     );
        // }
        // const base64Image = `data:image/png;base64,${base64Data}`;
        // await Share.open({
        //     title: 'Title',
        //     url: base64Image,
        //     message: link,
        //     subject: 'Subject',
        // });
        // return RNFetchBlob.fs.unlink(imagePath);

        Share.open({
            message: 'Doffy share',
            url: link,
        });
    } catch (err) {
        appAlert(err);
    } finally {
        setDisableShare(false);
    }
};

const screenWidth = Metrics.width;

const Bubble = (props: Props) => {
    const {
        item,
        onShowMoreOption,
        onShowModalComment,
        isFocusing = false,
        onChangePostIdFocusing,
    } = props;
    const isModeExp = Redux.getModeExp();
    const theme = Redux.getTheme();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
    const [disableShare, setDisableShare] = useState(false);
    const [isSaved, setIsSaved] = useState(item.isSaved);

    useEffect(() => {
        setIsLiked(item.isLiked);
        setTotalLikes(item.totalLikes);
    }, [item.isLiked, item.totalLikes]);

    /**
     * Render view
     */
    const Header = () => {
        return (
            <View style={styles.headerView}>
                <View style={styles.avatarNameOptionBox}>
                    <StyleTouchable
                        customStyle={styles.avatarFeeling}
                        onPress={() => onGoToProfile(item.creator)}>
                        <StyleImage
                            source={{uri: item.creatorAvatar}}
                            customStyle={styles.avatar}
                        />
                    </StyleTouchable>

                    {item.feeling !== null && (
                        <StyleIcon
                            source={chooseIconFeeling(item.feeling)}
                            customStyle={styles.feeling}
                            size={17}
                        />
                    )}

                    <View style={styles.nameTime}>
                        <StyleText
                            originValue={item.creatorName}
                            customStyle={[
                                styles.textName,
                                {color: theme.textHightLight},
                            ]}
                        />
                        <StyleText
                            originValue={formatFromNow(item.created)}
                            customStyle={[
                                styles.textCreated,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>

                    {item.topic !== null && (
                        <StyleText
                            originValue="   ・ "
                            customStyle={[
                                styles.textTopic,
                                {color: theme.textColor},
                            ]}>
                            <StyleText
                                i18Text={chooseTextTopic(item.topic)}
                                customStyle={[
                                    styles.textTopic,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleText>
                    )}

                    <StyleTouchable
                        customStyle={styles.iconMore}
                        onPress={() =>
                            onShowMoreOption({
                                idUser: item.creator,
                                nameUser: item.creatorName,
                                imageWantToSee: item.images,
                                allowSaveImage: true,
                                postModal: item,
                            })
                        }
                        hitSlop={{left: 5, right: 5, top: 10, bottom: 10}}>
                        <StyleIcon
                            source={Images.icons.more}
                            size={15}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>
                </View>

                {!!item.location && (
                    <View style={styles.locationBox}>
                        <Ionicons
                            name="ios-location-sharp"
                            style={[
                                styles.iconLocationCaption,
                                {color: Theme.common.commentGreen},
                            ]}
                        />
                        <StyleText
                            originValue={item.location}
                            customStyle={[
                                styles.textLocation,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                )}

                {item.content ? (
                    <StyleMoreText
                        value={item.content}
                        textStyle={[
                            styles.textCaption,
                            {color: theme.textColor},
                        ]}
                        containerStyle={styles.captionBox}
                        maxRows={3}
                    />
                ) : (
                    <View style={styles.spaceCaption} />
                )}
            </View>
        );
    };

    const StarLink = () => {
        const arrayStars = Array(item.stars).fill(0);
        return (
            <View style={styles.starLink}>
                <LinearGradient
                    colors={[
                        Theme.common.gradientTabBar1,
                        Theme.common.gradientTabBar2,
                    ]}
                    style={styles.starBox}>
                    {arrayStars.map((_, index) => (
                        <AntDesign
                            key={index}
                            name="star"
                            style={styles.star}
                        />
                    ))}
                </LinearGradient>
                {item?.link && (
                    <StyleTouchable
                        customStyle={styles.linkBox}
                        onPress={() => onOpenLink(item.link || '')}>
                        <LinearGradient
                            colors={[
                                Theme.common.gradientTabBar1,
                                Theme.common.gradientTabBar2,
                            ]}
                            style={styles.linkTouch}>
                            <View style={styles.iconHouseTouch}>
                                <StyleImage
                                    source={Images.icons.house}
                                    customStyle={styles.iconHouse}
                                />
                            </View>
                            <StyleText
                                originValue={'See now'}
                                customStyle={styles.textSeeNow}
                            />
                        </LinearGradient>
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const Footer = () => {
        if (item.isDraft) {
            return (
                <View style={styles.footerView}>
                    <StyleText
                        i18Text="profile.thisPostInDraft"
                        customStyle={[
                            styles.textThisPostInDraft,
                            {color: theme.holderColorLighter},
                        ]}
                    />
                    <StyleTouchable
                        customStyle={[
                            styles.goToPostBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() => onGoToPublicDraft(item)}>
                        <StyleText
                            i18Text="profile.goToPost"
                            customStyle={[
                                styles.textGoToPost,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            );
        }

        if (item.isArchived) {
            return (
                <View style={styles.footerView}>
                    <StyleTouchable
                        customStyle={[
                            styles.goToPostBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() => onUnArchivePost(item)}>
                        <StyleText
                            i18Text="profile.post.unArchive"
                            customStyle={[
                                styles.textGoToPost,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            );
        }

        return (
            <View style={styles.footerView}>
                <View style={styles.likeCommentShareSave}>
                    {isLiked ? (
                        <IconLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.likeHeart},
                            ]}
                            onPress={() =>
                                onHandleLike({
                                    isModeExp,
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                })
                            }
                        />
                    ) : (
                        <IconNotLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.textHightLight},
                            ]}
                            onPress={() =>
                                onHandleLike({
                                    isModeExp,
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                })
                            }
                        />
                    )}

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={() => onShowModalComment(item, 'comment')}>
                        <StyleIcon
                            source={Images.icons.comment}
                            size={20}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={() => onShowModalShare(item, setDisableShare)}
                        disable={disableShare}>
                        <StyleIcon
                            source={Images.icons.share}
                            size={21}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconSave}
                        onPress={() =>
                            onHandleSave({
                                isModeExp,
                                isSaved,
                                setIsSaved,
                                postId: item.id,
                            })
                        }>
                        {isSaved ? (
                            <FontAwesome
                                name="bookmark"
                                style={[
                                    styles.save,
                                    {color: Theme.common.gradientTabBar1},
                                ]}
                            />
                        ) : (
                            <FontAwesome
                                name="bookmark-o"
                                style={[
                                    styles.save,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        )}
                    </StyleTouchable>
                </View>

                <StyleTouchable
                    customStyle={styles.likeTouch}
                    onPress={() => {
                        if (totalLikes) {
                            onShowModalComment(item, 'like');
                        } else {
                            onHandleLike({
                                isModeExp,
                                isLiked,
                                setIsLiked,
                                totalLikes,
                                setTotalLikes,
                                postId: item.id,
                            });
                        }
                    }}>
                    <StyleText
                        i18Text={
                            totalLikes
                                ? 'discovery.numberLike'
                                : 'discovery.like'
                        }
                        i18Params={{
                            value: totalLikes,
                        }}
                        customStyle={[
                            styles.textLike,
                            {color: theme.textColor},
                        ]}
                    />
                </StyleTouchable>

                <StyleTouchable
                    customStyle={styles.commentTouch}
                    onPress={() => onShowModalComment(item, 'comment')}>
                    <StyleText
                        i18Text={
                            item.totalComments
                                ? 'discovery.numberComments'
                                : 'discovery.comment'
                        }
                        i18Params={{
                            numberComments: item.totalComments,
                        }}
                        customStyle={[
                            styles.textComment,
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    const ImagePreview = () => {
        if (!item.images[0]) {
            return null;
        }
        const isVideo = checkIsVideo(item.images[0]);
        if (!isVideo) {
            return (
                <ScrollSyncSizeImage
                    images={item.images}
                    syncWidth={screenWidth}
                    onDoublePress={() => {
                        if (!isLiked) {
                            onHandleLike({
                                isModeExp,
                                isLiked,
                                setIsLiked,
                                totalLikes,
                                setTotalLikes,
                                postId: item.id,
                            });
                        } else {
                            // onSeeDetailImage(item.images);
                        }
                    }}
                    containerStyle={styles.imageView}
                />
            );
        }

        return (
            <VideoBubble
                source={{uri: item.images[0]}}
                onDoublePress={() => {
                    if (!isLiked) {
                        onHandleLike({
                            isModeExp,
                            isLiked,
                            setIsLiked,
                            totalLikes,
                            setTotalLikes,
                            postId: item.id,
                        });
                    } else {
                        // onSeeDetailImage(item.images);
                    }
                }}
                paused={!isFocusing}
            />
        );
    };

    return (
        <View
            style={[styles.container, {backgroundColor: theme.backgroundColor}]}
            onTouchEnd={() => onChangePostIdFocusing(item.id)}>
            {Header()}
            {ImagePreview()}
            {StarLink()}
            {Footer()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginBottom: '5@vs',
        paddingVertical: '10@vs',
    },
    // header
    headerView: {
        width: '100%',
        paddingHorizontal: '15@s',
    },
    avatarNameOptionBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarFeeling: {
        width: '35@s',
        height: '35@s',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '25@s',
    },
    feeling: {
        position: 'absolute',
        bottom: '-1@s',
        left: '23@s',
    },
    nameTime: {
        maxWidth: '50%',
        marginLeft: '10@ms',
    },
    textName: {
        fontSize: '14@ms',
        fontWeight: 'bold',
    },
    textCreated: {
        fontSize: '10@ms',
        marginTop: '2@vs',
    },
    textTopic: {
        fontSize: '12@ms',
    },
    iconMore: {
        position: 'absolute',
        right: 0,
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '15@vs',
    },
    iconLocationCaption: {
        fontSize: '17@ms',
    },
    textLocation: {
        fontSize: '12@ms',
        marginLeft: '2@s',
    },
    captionBox: {
        marginVertical: '10@vs',
    },
    spaceCaption: {
        height: '10@vs',
    },
    textCaption: {
        fontSize: '14@ms',
    },
    // image
    imageView: {
        maxHeight: Metrics.width * 1.5,
    },
    // star link
    starLink: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '10@vs',
        paddingHorizontal: '14@s',
    },
    starBox: {
        height: '22@ms',
        paddingHorizontal: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5@ms',
    },
    star: {
        fontSize: '14@ms',
        marginHorizontal: '3@s',
        color: Theme.common.orange,
    },
    linkBox: {
        marginLeft: '10@s',
    },
    linkTouch: {
        height: '22@ms',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
    },
    iconHouseTouch: {
        width: '17@ms',
        height: '17@ms',
        backgroundColor: Theme.common.white,
        borderRadius: '15@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconHouse: {
        width: '8@ms',
        height: '8@ms',
    },
    textSeeNow: {
        fontSize: '10@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
        marginLeft: '7@s',
    },
    // footer
    footerView: {
        width: '100%',
        paddingHorizontal: '15@s',
    },
    textThisPostInDraft: {
        fontSize: '12@ms',
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    goToPostBox: {
        paddingHorizontal: '10@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5@vs',
        alignSelf: 'center',
    },
    textGoToPost: {
        fontSize: '14@ms',
        fontWeight: 'bold',
    },
    likeCommentShareSave: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '15@vs',
        alignItems: 'center',
    },
    iconLike: {
        fontSize: '22@ms',
    },
    iconComment: {
        marginLeft: '20@s',
    },
    iconSave: {
        position: 'absolute',
        right: 0,
    },
    save: {
        fontSize: '24@ms',
    },
    likeTouch: {
        marginTop: '10@vs',
        width: '100@s',
        paddingVertical: '5@vs',
    },
    textLike: {
        fontSize: '12@ms',
        fontWeight: 'bold',
    },
    textComment: {
        fontSize: '12@ms',
    },
    commentTouch: {
        paddingVertical: '5@vs',
        width: '50%',
    },
});

export default memo(Bubble, (preProps: Props, nextProps: any) => {
    if (
        !isEqual(preProps.item, nextProps.item) ||
        nextProps.isFocusing !== preProps.isFocusing
    ) {
        return false;
    }
    return true;
});
