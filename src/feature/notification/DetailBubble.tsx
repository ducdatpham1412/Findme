/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-expressions */
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeBubblePalace} from 'api/interface';
import {apiGetDetailBubble} from 'api/module';
import {apiLikePost, apiSavePost, apiUnLikePost, apiUnSavePost} from 'api/post';
import FindmeStore from 'app-redux/store';
import {TYPE_DYNAMIC_LINK} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    LANDING_PAGE_URL,
} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import InputComment from 'components/common/InputComment';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import StyleKeyboardAwareView from 'components/StyleKeyboardAwareView';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {chooseIconFeeling, chooseTextTopic} from 'utility/assistant';
import {formatFromNow} from 'utility/format';
import ModalCommentDetailBubble, {
    showModalCommentDetailBubble,
} from './components/ModalCommentDetailBubble';

interface Props {
    route: {
        params: {
            bubbleId: string;
            displayComment: boolean;
        };
    };
}

const onGoToProfile = (userId: number | undefined) => {
    if (userId) {
        const myId = FindmeStore.getState().accountSlice.passport.profile.id;
        if (userId === myId) {
            navigate(PROFILE_ROUTE.myProfile);
        } else {
            navigate(ROOT_SCREEN.otherProfile, {
                id: userId,
            });
        }
    }
};

const onSeeDetailImage = (images: Array<string>) => {
    showSwipeImages({
        listImages: images.map(item => ({url: item})),
        allowSaveImage: true,
    });
};

const DetailBubble = ({route}: Props) => {
    const {bubbleId, displayComment} = route.params;
    const theme = Redux.getTheme();

    const optionsRef = useRef<any>(null);

    const [bubble, setBubble] = useState<TypeBubblePalace>();

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

    useEffect(() => {
        if (displayComment) {
            showModalCommentDetailBubble();
        }
    }, [displayComment]);

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

    const onHandleSave = async () => {
        if (bubble) {
            const currentSave = bubble?.isSaved;

            try {
                setBubble({
                    ...bubble,
                    isSaved: !currentSave,
                });
                if (currentSave) {
                    await apiUnSavePost(bubble.id);
                } else {
                    await apiSavePost(bubble.id);
                }
            } catch (err) {
                setBubble({
                    ...bubble,
                    isSaved: currentSave,
                });
                appAlert(err);
            }
        }
    };

    const onShowModalShare = async () => {
        if (!bubble?.id) {
            return;
        }
        try {
            const link = await dynamicLinks().buildShortLink({
                link: `${bubble?.images?.[0] || LANDING_PAGE_URL}?type=${
                    TYPE_DYNAMIC_LINK.post
                }&post_id=${bubble.id}`,
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
        }
    };

    /**
     * Render view
     */
    const Header = () => {
        return (
            <View style={styles.headerView}>
                <View style={styles.avatarNameOptionBox}>
                    <StyleTouchable
                        customStyle={styles.avatarFeeling}
                        onPress={() => onGoToProfile(bubble?.creator)}>
                        <StyleImage
                            source={{uri: bubble?.creatorAvatar}}
                            customStyle={styles.avatar}
                            defaultSource={Images.images.defaultAvatar}
                        />
                    </StyleTouchable>

                    {typeof bubble?.feeling === 'number' && (
                        <StyleIcon
                            source={chooseIconFeeling(bubble?.feeling)}
                            customStyle={styles.feeling}
                            size={17}
                        />
                    )}

                    <View style={styles.nameTime}>
                        <StyleText
                            originValue={bubble?.creatorName || ''}
                            customStyle={[
                                styles.textName,
                                {color: theme.textHightLight},
                            ]}
                        />
                        {bubble?.created && (
                            <StyleText
                                originValue={formatFromNow(bubble?.created)}
                                customStyle={[
                                    styles.textCreated,
                                    {color: theme.borderColor},
                                ]}
                            />
                        )}
                    </View>

                    {typeof bubble?.topic === 'number' && (
                        <StyleText
                            originValue="   ・ "
                            customStyle={[
                                styles.textTopic,
                                {color: theme.textColor},
                            ]}>
                            <StyleText
                                i18Text={chooseTextTopic(bubble.topic)}
                                customStyle={[
                                    styles.textTopic,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleText>
                    )}

                    <StyleTouchable
                        customStyle={styles.iconMore}
                        onPress={() => optionsRef.current?.show()}>
                        <StyleIcon
                            source={Images.icons.more}
                            size={15}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>
                </View>

                {bubble?.location && (
                    <View style={styles.locationBox}>
                        <Ionicons
                            name="ios-location-sharp"
                            style={[
                                styles.iconLocationCaption,
                                {color: Theme.common.commentGreen},
                            ]}
                        />
                        <StyleText
                            originValue={bubble.location}
                            customStyle={[
                                styles.textLocation,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                )}

                {bubble?.content ? (
                    <StyleMoreText
                        value={bubble.content}
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
        const arrayStars = Array(bubble?.stars).fill(0);
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
                    {bubble?.link && (
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
                    {bubble?.isLiked ? (
                        <IconLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.likeHeart},
                            ]}
                            onPress={onHandleLike}
                        />
                    ) : (
                        <IconNotLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.textHightLight},
                            ]}
                            onPress={onHandleLike}
                        />
                    )}

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={showModalCommentDetailBubble}>
                        <StyleIcon
                            source={Images.icons.comment}
                            size={20}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={onShowModalShare}>
                        <StyleIcon
                            source={Images.icons.share}
                            size={21}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconSave}
                        onPress={onHandleSave}>
                        {bubble?.isSaved ? (
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
                    onPress={showModalCommentDetailBubble}>
                    <StyleText
                        i18Text={
                            bubble?.totalLikes
                                ? 'discovery.numberLike'
                                : 'discovery.like'
                        }
                        i18Params={{
                            value: bubble?.totalLikes || '',
                        }}
                        customStyle={[
                            styles.textLike,
                            {color: theme.textColor},
                        ]}
                    />
                </StyleTouchable>

                <StyleTouchable
                    customStyle={styles.commentTouch}
                    onPress={showModalCommentDetailBubble}>
                    <StyleText
                        i18Text={
                            bubble?.totalComments
                                ? 'discovery.numberComments'
                                : 'discovery.comment'
                        }
                        i18Params={{
                            numberComments: bubble?.totalComments || '',
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
        <>
            <StyleHeader title={bubble?.creatorName || ''} />
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}
                showsVerticalScrollIndicator={false}>
                {Header()}
                <ScrollSyncSizeImage
                    images={bubble?.images || []}
                    syncWidth={Metrics.width}
                    onDoublePress={() => {
                        if (!bubble?.isLiked) {
                            onHandleLike();
                        } else {
                            onSeeDetailImage(bubble?.images);
                        }
                    }}
                    containerStyle={styles.imageView}
                />
                {Footer()}
            </ScrollView>

            <ModalCommentDetailBubble
                bubbleFocusing={bubble}
                setBubbleFocusing={setBubble}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingBottom: Metrics.safeBottomPadding,
    },
    // header
    headerView: {
        width: '100%',
        paddingHorizontal: '15@s',
        marginTop: '10@vs',
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

export default DetailBubble;