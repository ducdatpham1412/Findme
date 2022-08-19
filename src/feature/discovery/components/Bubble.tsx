/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-expressions */
import {TypeBubblePalace} from 'api/interface';
import {apiLikePost, apiSavePost, apiUnLikePost, apiUnSavePost} from 'api/post';
import FindmeStore from 'app-redux/store';
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
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {memo, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseIconFeeling,
    chooseTextTopic,
    onGoToSignUp,
} from 'utility/assistant';
import {formatFromNow} from 'utility/format';
import {TypeShowMoreOptions} from '../ListBubbleCouple';

interface Props {
    item: TypeBubblePalace;
    onShowMoreOption(params: TypeShowMoreOptions): void;
    onRefreshItem(idBubble: string): Promise<void>;
    onShowModalComment(post: TypeBubblePalace): void;
    onShowModalShare(item: any): void;
}

const onGoToProfile = (userId: number) => {
    const myId = FindmeStore.getState().accountSlice.passport.profile.id;
    if (userId === myId) {
        navigate(PROFILE_ROUTE.myProfile);
    } else {
        navigate(ROOT_SCREEN.otherProfile, {
            id: userId,
        });
    }
};

// const onSeeDetailImage = (images: Array<string>) => {
//     showSwipeImages({
//         listImages: images.map(item => ({url: item})),
//         allowSaveImage: true,
//     });
// };

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

const Bubble = (props: Props) => {
    const {item, onShowMoreOption, onShowModalComment, onShowModalShare} =
        props;
    const isModeExp = Redux.getModeExp();
    const theme = Redux.getTheme();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
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
                            defaultSource={Images.images.defaultAvatar}
                        />
                    </StyleTouchable>

                    {!!item.feeling && (
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
                                imageWantToSee: item.images,
                                allowSaveImage: true,
                            })
                        }>
                        <StyleIcon
                            source={Images.icons.more}
                            size={15}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>
                </View>

                {item.location && (
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

    const Footer = () => {
        const arrayStars = Array(item.stars).fill(0);
        return (
            <View style={styles.footerView}>
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
                    {!item.link && (
                        <StyleTouchable customStyle={styles.linkBox}>
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
                        onPress={() => onShowModalComment(item)}>
                        <StyleIcon
                            source={Images.icons.comment}
                            size={20}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={() => onShowModalShare(item)}>
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
                            onShowModalComment(item);
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
                    onPress={() => onShowModalComment(item)}>
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

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {Header()}

            <ScrollSyncSizeImage
                images={item.images}
                syncWidth={Metrics.width}
            />

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
    // footer
    footerView: {
        width: '100%',
        paddingHorizontal: '15@s',
        marginTop: '6@vs',
    },
    starLink: {
        width: '100%',
        flexDirection: 'row',
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
        fontSize: '22@ms',
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
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    return true;
});
