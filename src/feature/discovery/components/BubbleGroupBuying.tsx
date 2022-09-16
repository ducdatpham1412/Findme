import {TypeGroupBuying} from 'api/interface';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    FONT_SIZE,
    LANDING_PAGE_URL,
    ratioImageGroupBuying,
} from 'asset/standardValue';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo, useState} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {SharedElement} from 'react-navigation-shared-element';
import {chooseTextTopic, onGoToProfile, onGoToSignUp} from 'utility/assistant';
import {formatFromNow} from 'utility/format';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from 'asset/theme/Theme';
import StyleMoreText from 'components/StyleMoreText';
import LinearGradient from 'react-native-linear-gradient';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TYPE_DYNAMIC_LINK} from 'asset/enum';
import {appAlert, goBack} from 'navigation/NavigationService';
import Share from 'react-native-share';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiLikePost, apiUnLikePost} from 'api/post';
import {TypeMoreOptionsMe, TypeShowMoreOptions} from '../DiscoveryScreen';

interface Props {
    item: TypeGroupBuying;
    onGoToDetailGroupBuying(item: TypeGroupBuying): void;
    onShowMoreOption(params: TypeShowMoreOptions & TypeMoreOptionsMe): void;
    onShowModalComment(
        post: TypeGroupBuying,
        type: TypeShowModalCommentOrLike,
    ): void;
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

const onShowModalShare = async (
    item: TypeGroupBuying,
    setDisableShare: Function,
) => {
    try {
        setDisableShare(true);
        const link = await dynamicLinks().buildShortLink({
            link: `${item?.images?.[0] || LANDING_PAGE_URL}?type=${
                TYPE_DYNAMIC_LINK.groupBuying
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

const BubbleGroupBuying = (props: Props) => {
    const {
        item,
        onGoToDetailGroupBuying,
        onShowMoreOption,
        onShowModalComment,
    } = props;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
    const [disableShare, setDisableShare] = useState(false);

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

                {!!item.creatorLocation && (
                    <View style={styles.locationBox}>
                        <Ionicons
                            name="ios-location-sharp"
                            style={[
                                styles.iconLocationCaption,
                                {color: Theme.common.commentGreen},
                            ]}
                        />
                        <StyleText
                            originValue={item.creatorLocation}
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

    const PriceAndTotalJoins = () => {
        const isBiggerThanThree = item.prices.length > 3;
        const displayPrices = isBiggerThanThree
            ? item.prices.slice(0, 3)
            : item.prices;
        return (
            <View style={styles.linearOverlay}>
                <LinearGradient
                    style={[styles.linearOverlay, {opacity: 0.7}]}
                    colors={['black', 'transparent']}
                    start={{x: 0, y: 1}}
                    end={{x: 0.8, y: 1}}
                />
                {displayPrices.map((price, index) => (
                    <View key={index} style={styles.priceBox}>
                        <StyleText
                            originValue={price.number_people}
                            customStyle={styles.textNumberPeople}
                        />
                        <StyleText originValue="-" customStyle={styles.dash} />
                        <StyleText
                            originValue={`${price.value}vnd`}
                            customStyle={styles.textPrice}
                        />
                    </View>
                ))}
                {isBiggerThanThree && (
                    <View style={styles.priceBox}>
                        <StyleText
                            originValue="..."
                            customStyle={styles.textNumberPeople}
                        />
                    </View>
                )}
                <View style={styles.peopleJoinBox}>
                    <StyleIcon
                        source={Images.icons.createGroup}
                        size={20}
                        customStyle={styles.iconJoined}
                    />
                    {!!item.totalJoins && (
                        <StyleText
                            originValue={item.totalJoins}
                            customStyle={styles.textJoined}
                        />
                    )}
                </View>
            </View>
        );
    };

    const Footer = () => {
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
                        customStyle={[
                            styles.joinGroupBuyingBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() => onGoToDetailGroupBuying(item)}>
                        <StyleText
                            i18Text="discovery.joinGroupBuying"
                            customStyle={[
                                styles.textTellJoin,
                                {color: theme.textHightLight},
                            ]}
                        />
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

    return (
        <StyleTouchable
            style={[styles.container, {backgroundColor: theme.backgroundColor}]}
            onPress={() => onGoToDetailGroupBuying(item)}>
            {Header()}

            <SharedElement style={styles.imageView} id="image_group_buying">
                <StyleImage
                    source={{
                        uri: item.images[0],
                    }}
                    customStyle={styles.image}
                    defaultSource={Images.images.defaultImage}
                />
                {PriceAndTotalJoins()}
            </SharedElement>

            {Footer()}
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginBottom: '5@vs',
        paddingVertical: '10@vs',
        alignItems: 'center',
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
    // image preview
    imageView: {
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: Metrics.width,
        height: Metrics.width * ratioImageGroupBuying,
        borderRadius: '5@ms',
    },
    linearOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    priceBox: {
        flexDirection: 'row',
        marginLeft: '10@s',
        marginVertical: '5@vs',
    },
    textNumberPeople: {
        width: '35@ms',
        color: Theme.common.white,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.small,
    },
    dash: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.white,
    },
    textPrice: {
        color: Theme.common.white,
        fontSize: FONT_SIZE.small,
        marginLeft: '15@ms',
    },
    peopleJoinBox: {
        position: 'absolute',
        bottom: '5@vs',
        left: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconJoined: {
        tintColor: Theme.common.white,
    },
    textJoined: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginLeft: '5@s',
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
        fontSize: '23@ms',
    },
    iconComment: {
        marginLeft: '20@s',
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
    joinGroupBuyingBox: {
        position: 'absolute',
        right: 0,
        paddingHorizontal: '20@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    textTellJoin: {
        fontSize: FONT_SIZE.small,
    },
});

export default memo(BubbleGroupBuying, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    return true;
});
