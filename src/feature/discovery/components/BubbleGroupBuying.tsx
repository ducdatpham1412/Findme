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
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleMoreText from 'components/StyleMoreText';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import {chooseTextTopic, onGoToProfile} from 'utility/assistant';
import {
    formatDayGroupBuying,
    formatFromNow,
    formatLocaleNumber,
} from 'utility/format';
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

                    {item.topic.map(topic => (
                        <StyleText
                            key={topic}
                            originValue="   ・ "
                            customStyle={[
                                styles.textTopic,
                                {color: theme.textColor},
                            ]}>
                            <StyleText
                                i18Text={chooseTextTopic(topic)}
                                customStyle={[
                                    styles.textTopic,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleText>
                    ))}

                    <StyleTouchable
                        customStyle={styles.iconMore}
                        onPress={() =>
                            onShowMoreOption({
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
                <View style={styles.priceView}>
                    <StyleIcon source={Images.icons.dollar} size={15} />
                    <View>
                        {displayPrices.map((price, index) => (
                            <View key={index} style={styles.priceBox}>
                                <StyleText
                                    originValue={price.number_people}
                                    customStyle={styles.textNumberPeople}
                                />
                                <StyleText
                                    originValue="-"
                                    customStyle={styles.dash}
                                />
                                <StyleText
                                    originValue={`${formatLocaleNumber(
                                        price.value,
                                    )}vnd`}
                                    customStyle={styles.textPrice}
                                />
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.priceView}>
                    <StyleIcon source={Images.icons.deadline} size={15} />
                    <StyleText
                        originValue={formatDayGroupBuying(item.deadlineDate)}
                        customStyle={styles.textDeadline}
                    />
                </View>

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

    const ButtonCheckJoined = () => {
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
            const isJoined =
                item.status === GROUP_BUYING_STATUS.joinedNotBought;
            return (
                <StyleTouchable
                    customStyle={[
                        styles.joinGroupBuyingBox,
                        {
                            backgroundColor: isJoined
                                ? theme.highlightColor
                                : theme.backgroundButtonColor,
                        },
                    ]}
                    onPress={() => onGoToDetailGroupBuying(item)}>
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
                </StyleTouchable>
            );
        }
        return null;
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
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                })
                            }
                            touchableStyle={styles.touchIconLike}
                        />
                    ) : (
                        <IconNotLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.textHightLight},
                            ]}
                            onPress={() =>
                                onHandleLike({
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                })
                            }
                            touchableStyle={styles.touchIconLike}
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

                    {ButtonCheckJoined()}
                </View>

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
            onPress={() => onGoToDetailGroupBuying(item)}
            onTouchEnd={() => onChangePostIdFocusing(item.id)}>
            {Header()}

            <SharedElement
                style={styles.imageView}
                id={`item.group_buying.${item.id}`}>
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
        width: '35@ms',
        height: '35@ms',
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
        marginLeft: '10@s',
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
    priceView: {
        flexDirection: 'row',
        marginLeft: '5@s',
        marginVertical: '5@vs',
        alignItems: 'center',
    },
    priceBox: {
        flexDirection: 'row',
        marginLeft: '5@s',
        marginBottom: '5@vs',
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
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginLeft: '5@s',
    },
    textDeadline: {
        color: Theme.common.white,
        fontSize: FONT_SIZE.small,
        marginLeft: '5@s',
    },
    // footer
    footerView: {
        width: '100%',
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
    touchIconLike: {
        paddingLeft: '15@s',
        paddingRight: '10@s',
    },
    iconLike: {
        fontSize: '23@ms',
    },
    iconComment: {
        paddingHorizontal: '10@s',
    },
    likeTouch: {
        marginTop: '10@vs',
        marginLeft: '15@s',
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
        marginLeft: '15@s',
    },
    joinGroupBuyingBox: {
        position: 'absolute',
        right: '15@s',
        paddingHorizontal: '20@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    boughtBox: {
        position: 'absolute',
        right: '15@s',
        padding: '5@ms',
        backgroundColor: Theme.common.gradientTabBar2,
        borderRadius: '20@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBought: {
        fontSize: '20@ms',
        color: Theme.common.white,
    },
    textBought: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.white,
        marginHorizontal: '3@s',
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
