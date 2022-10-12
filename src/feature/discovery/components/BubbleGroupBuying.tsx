import {BlurView} from '@react-native-community/blur';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeGroupBuying} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {GROUP_BUYING_STATUS, RELATIONSHIP, TYPE_DYNAMIC_LINK} from 'asset/enum';
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
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import {SharedElement} from 'react-navigation-shared-element';
import {onGoToProfile} from 'utility/assistant';
import {formatDayGroupBuying, formatLocaleNumber} from 'utility/format';
import {TypeMoreOptionsMe} from '../DiscoveryScreen';

export interface ParamsLikeGB {
    isLiked: boolean;
    setIsLiked: Function;
    totalLikes: number;
    setTotalLikes: Function;
    postId: string;
}

interface Props {
    item: TypeGroupBuying;
    onGoToDetailGroupBuying(item: TypeGroupBuying): void;
    onShowMoreOption(params: TypeMoreOptionsMe): void;
    onHandleLike(params: ParamsLikeGB): void;
    onShowModalComment(
        post: TypeGroupBuying,
        type: TypeShowModalCommentOrLike,
    ): void;
    onChangePostIdFocusing(postId: string): void;
    detailGroupTarget: string;
}

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

const {width} = Metrics;

const CustomBlurView = () => {
    return (
        <BlurView
            style={styles.blurView}
            blurType="ultraThinMaterialLight"
            blurAmount={0}
            blurRadius={1}
            reducedTransparencyFallbackColor="white"
        />
    );
};

const ButtonCheckJoined = (item: TypeGroupBuying, theme: TypeTheme) => {
    if (item.relationship === RELATIONSHIP.self) {
        return null;
    }
    if (item.status === GROUP_BUYING_STATUS.bought) {
        return (
            <LinearGradient
                style={styles.boughtBox}
                colors={[
                    Theme.common.commentGreen,
                    Theme.common.gradientTabBar2,
                ]}>
                <Entypo name="check" style={styles.iconBought} />
                <StyleText
                    i18Text="discovery.bought"
                    customStyle={styles.textBought}
                />
            </LinearGradient>
        );
    }
    if (
        [
            GROUP_BUYING_STATUS.notJoined,
            GROUP_BUYING_STATUS.joinedNotBought,
        ].includes(item.status)
    ) {
        const isJoined = item.status === GROUP_BUYING_STATUS.joinedNotBought;
        return (
            <View
                style={[
                    styles.joinGroupBuyingBox,
                    {
                        backgroundColor: isJoined
                            ? theme.highlightColor
                            : theme.backgroundButtonColor,
                    },
                ]}>
                <StyleText
                    i18Text={
                        isJoined
                            ? 'discovery.joined'
                            : 'discovery.joinGroupBuying'
                    }
                    customStyle={[
                        styles.textTellJoin,
                        {
                            color: isJoined
                                ? theme.backgroundColor
                                : theme.textHightLight,
                            fontWeight: isJoined ? 'bold' : 'normal',
                        },
                    ]}
                />
            </View>
        );
    }

    return null;
};

const BubbleGroupBuying = (props: Props) => {
    const {
        item,
        onGoToDetailGroupBuying,
        onShowMoreOption,
        onHandleLike,
        onShowModalComment,
        onChangePostIdFocusing,
    } = props;
    const theme = Redux.getTheme();

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
    const [disableShare, setDisableShare] = useState(false);

    useEffect(() => {
        setIsLiked(item.isLiked);
    }, [item.isLiked]);

    useEffect(() => {
        setTotalLikes(item.totalLikes);
    }, [item.totalLikes]);

    const lastPrice = item.prices[item.prices.length - 1];

    return (
        <StyleTouchable
            key={item.id}
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                },
            ]}
            onPress={() => onGoToDetailGroupBuying(item)}
            onTouchEnd={() => onChangePostIdFocusing(item.id)}>
            {/* Image preview */}
            <SharedElement
                style={styles.imagePreview}
                id={`item.group_buying.${item.id}`}>
                <StyleImage
                    source={{uri: item.images[0]}}
                    customStyle={styles.imagePreview}
                />

                <View style={styles.topView}>
                    <StyleTouchable
                        customStyle={styles.creatorView}
                        onPress={() => onGoToProfile(item.creator)}>
                        <CustomBlurView />
                        <StyleIcon
                            source={{uri: item.creatorAvatar}}
                            size={20}
                            customStyle={styles.avatar}
                        />
                        <StyleText
                            originValue={item.creatorName}
                            numberOfLines={1}
                            customStyle={styles.textName}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconMoreView}
                        onPress={() =>
                            onShowMoreOption({
                                postModal: item,
                            })
                        }
                        hitSlop={{left: 5, right: 5, top: 10, bottom: 10}}>
                        <StyleIcon
                            source={Images.icons.more}
                            size={15}
                            customStyle={styles.iconMore}
                        />
                    </StyleTouchable>
                </View>

                <View style={styles.bottomView}>
                    <View style={styles.bottomLeft}>
                        <View style={styles.numberJoinedBox}>
                            <CustomBlurView />
                            <StyleIcon
                                source={Images.icons.createGroup}
                                size={15}
                                customStyle={styles.iconNumberPeople}
                            />
                            <StyleText
                                originValue={item.totalJoins}
                                customStyle={styles.textNumberPeople}
                            />
                        </View>

                        {!!item.creatorLocation && (
                            <View style={styles.locationBox}>
                                <CustomBlurView />
                                <Entypo
                                    name="location-pin"
                                    style={styles.iconLocation}
                                />
                                <StyleText
                                    originValue={item.creatorLocation}
                                    customStyle={styles.textLocation}
                                    numberOfLines={1}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.leftRight}>
                        <StyleTouchable
                            customStyle={styles.contractBox}
                            onPress={() => onShowModalComment(item, 'comment')}>
                            <CustomBlurView />
                            <StyleIcon
                                source={Images.icons.comment}
                                size={14}
                                customStyle={{tintColor: Theme.common.white}}
                            />
                        </StyleTouchable>
                        <StyleTouchable
                            customStyle={styles.contractBox}
                            disableOpacity={0.85}
                            onPress={() =>
                                onShowModalShare(item, setDisableShare)
                            }
                            disable={disableShare}>
                            <CustomBlurView />
                            <StyleIcon
                                source={Images.icons.share}
                                size={15}
                                customStyle={{tintColor: Theme.common.white}}
                            />
                        </StyleTouchable>
                    </View>
                </View>
            </SharedElement>

            {/* Content */}
            {!!item.content && (
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.textContent,
                        {color: theme.textHightLight},
                    ]}
                    numberOfLines={1}
                />
            )}

            <View style={styles.contentView}>
                <View style={{flex: 1}}>
                    <View style={styles.infoView}>
                        <StyleIcon source={Images.icons.deadline} size={15} />
                        <StyleText
                            originValue={formatDayGroupBuying(
                                item.deadlineDate,
                            )}
                            customStyle={[
                                styles.textInfo,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                    <View style={styles.infoView}>
                        <StyleIcon source={Images.icons.dollar} size={15} />
                        <StyleText
                            originValue={`${lastPrice.number_people}`}
                            customStyle={[
                                styles.textInfo,
                                {color: theme.borderColor},
                            ]}
                        />
                        <StyleText
                            originValue=" - "
                            customStyle={[
                                styles.textInfo,
                                {color: theme.borderColor},
                            ]}
                        />
                        <StyleText
                            originValue={`${formatLocaleNumber(
                                lastPrice.value,
                            )}vnd`}
                            customStyle={[
                                styles.textInfo,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                </View>
                {ButtonCheckJoined(item, theme)}
            </View>

            {/* Footer */}
            <View style={styles.footerView}>
                {isLiked ? (
                    <IconLiked
                        customStyle={[
                            styles.iconLike,
                            {color: theme.likeHeart},
                        ]}
                        touchableStyle={styles.touchIconLike}
                        onPress={() =>
                            onHandleLike({
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
                            {color: theme.borderColor},
                        ]}
                        touchableStyle={styles.touchIconLike}
                        onPress={() =>
                            onHandleLike({
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
                    customStyle={styles.likeTouch}
                    onPress={() => {
                        if (totalLikes) {
                            onShowModalComment(item, 'like');
                        } else {
                            onHandleLike({
                                isLiked,
                                setIsLiked,
                                totalLikes,
                                setTotalLikes,
                                postId: item.id,
                            });
                        }
                    }}
                    hitSlop={{top: 10, bottom: 10}}>
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
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>

                <StyleTouchable
                    customStyle={styles.commentTouch}
                    onPress={() => onShowModalComment(item, 'comment')}
                    hitSlop={{top: 10, bottom: 10}}>
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
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width,
        paddingVertical: '20@vs',
        marginTop: '-1@vs',
    },
    imagePreview: {
        width: '100%',
        borderRadius: '8@ms',
        height: width * ratioImageGroupBuying,
    },
    creatorView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '20@ms',
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
    },
    avatar: {
        borderRadius: '30@ms',
        marginLeft: '5@s',
        marginVertical: '2@s',
    },
    textName: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '5@s',
    },
    textCreated: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.grayLight,
    },
    topView: {
        position: 'absolute',
        top: '7@s',
        paddingHorizontal: '7@s',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    bottomView: {
        position: 'absolute',
        bottom: '7@s',
        paddingHorizontal: '7@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    bottomLeft: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    numberJoinedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '20@ms',
        overflow: 'hidden',
    },
    iconNumberPeople: {
        tintColor: Theme.common.white,
        marginLeft: '5@s',
        marginVertical: '2@s',
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '5@s',
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10@s',
        maxWidth: '80%',
        overflow: 'hidden',
        borderRadius: '20@ms',
    },
    iconLocation: {
        fontSize: '13@ms',
        marginLeft: '5@s',
        marginVertical: '2@s',
        color: Theme.common.white,
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.white,
        marginLeft: '3@s',
        maxWidth: '80%',
    },
    // content
    contentView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContent: {
        fontSize: FONT_SIZE.small,
        marginHorizontal: '10@s',
        marginVertical: '5@vs',
    },
    infoView: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '10@s',
        marginVertical: '5@vs',
        alignItems: 'center',
    },
    textInfo: {
        fontSize: FONT_SIZE.small,
        marginLeft: '8@s',
    },
    boughtBox: {
        marginRight: '10@s',
        padding: '5@ms',
        borderRadius: '20@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBought: {
        fontSize: '15@ms',
        color: Theme.common.white,
    },
    textBought: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '3@s',
    },
    joinGroupBuyingBox: {
        marginRight: '5@s',
        paddingHorizontal: '10@s',
        paddingVertical: '5@vs',
        borderRadius: '20@ms',
    },
    textTellJoin: {
        fontSize: FONT_SIZE.small,
    },
    leftRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contractBox: {
        width: '33@ms',
        height: '33@ms',
        borderRadius: '20@ms',
        marginLeft: '8@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerView: {
        width: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginTop: '5@vs',
    },
    iconLike: {
        fontSize: '30@ms',
    },
    touchIconLike: {
        paddingLeft: '10@s',
        paddingRight: '10@s',
        marginLeft: '10@s',
    },
    likeTouch: {
        paddingLeft: '10@s',
    },
    textLike: {
        fontSize: '12@ms',
        fontWeight: 'bold',
    },
    textComment: {
        fontSize: '12@ms',
    },
    commentTouch: {
        paddingLeft: '10@s',
    },
    iconMoreView: {
        position: 'absolute',
        right: '10@s',
        borderRadius: '10@ms',
        backgroundColor: Theme.common.black,
    },
    iconMore: {
        marginHorizontal: '3@s',
        tintColor: Theme.common.white,
    },
});

export default memo(BubbleGroupBuying, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    return true;
});
