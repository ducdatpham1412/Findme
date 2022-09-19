import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
    apiGetListPeopleJoined,
    apiJoinGroupBuying,
    apiLeaveGroupBuying,
} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiLikePost, apiUnLikePost} from 'api/post';
import {RELATIONSHIP, TYPE_DYNAMIC_LINK} from 'asset/enum';
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
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {appAlert, goBack} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useRef, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import {onGoToProfile, onGoToSignUp} from 'utility/assistant';
import {formatDayGroupBuying, formatFromNow} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import ModalPeopleJoined from './components/ModalPeopleJoined';

interface Props {
    route: {
        params: {
            item: TypeGroupBuying;
            setList: any;
        };
    };
}

interface ParamsInformation {
    title: I18Normalize;
    icon: any;
    titleColor: string;
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

const TitleInformation = (props: ParamsInformation) => {
    const {icon, title, titleColor} = props;
    return (
        <View style={styles.informationView}>
            <StyleIcon source={icon} size={18} />
            <StyleText
                i18Text={title}
                customStyle={[styles.titleInformation, {color: titleColor}]}
            />
        </View>
    );
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
            message: 'Doffy share\n',
            url: link,
        });
    } catch (err) {
        appAlert(err);
    } finally {
        setDisableShare(false);
    }
};

const screenWidth = Metrics.width;

const DetailGroupBuying = ({route}: Props) => {
    const {item, setList} = route.params;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const modalJoinedRef = useRef<Modalize>(null);

    const listJoinedPaging = usePaging({
        request: apiGetListPeopleJoined,
        params: {
            postId: item.id,
            take: 10,
        },
    });

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
    const [disableShare, setDisableShare] = useState(false);
    const [hadJoined, setHadJoined] = useState(item.isJoined);

    const isMyBubble = item.relationship === RELATIONSHIP.self;

    const onShowModalComment = (type: TypeShowModalCommentOrLike) => {
        if (isModeExp) {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
            });
        } else {
            showCommentDiscovery({
                post: item,
                type,
                setList,
            });
        }
    };

    const onJoinGroupBuying = async () => {
        const currenJoined = hadJoined;
        try {
            setHadJoined(!currenJoined);
            if (!currenJoined) {
                await apiJoinGroupBuying(item.id);
            } else {
                await apiLeaveGroupBuying(item.id);
            }
        } catch (err) {
            setHadJoined(currenJoined);
            appAlert(err);
        }
    };

    /**
     * Render views
     */
    const Information = () => {
        return (
            <>
                <TitleInformation
                    icon={Images.icons.calendar}
                    title="discovery.applicationPeriod"
                    titleColor={theme.textHightLight}
                />
                <View style={styles.timeView}>
                    <StyleText
                        originValue={formatDayGroupBuying(item.startDate)}
                        customStyle={[
                            styles.textTime,
                            {color: theme.textColor},
                        ]}
                    />
                    <StyleText
                        originValue="~"
                        customStyle={[
                            styles.textTime,
                            {color: theme.borderColor},
                        ]}
                    />
                    <StyleText
                        originValue={formatDayGroupBuying(item.startDate)}
                        customStyle={[
                            styles.textTime,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                <TitleInformation
                    icon={Images.icons.dollar}
                    title="discovery.groupBuyingPrice"
                    titleColor={theme.textHightLight}
                />
                <View style={styles.pricesView}>
                    {item.prices.map(price => (
                        <View key={price.number_people} style={styles.priceBox}>
                            <StyleText
                                i18Text="discovery.numberPeople"
                                i18Params={{
                                    value: price.number_people,
                                }}
                                customStyle={[
                                    styles.peoplePriceText,
                                    {width: '32%', color: theme.textColor},
                                ]}
                            />
                            <StyleText
                                originValue="-"
                                customStyle={[
                                    styles.peoplePriceText,
                                    {
                                        color: theme.borderColor,
                                        marginRight: '12%',
                                    },
                                ]}
                            />
                            <StyleText
                                originValue={`${price.value} vnd`}
                                style={[
                                    styles.peoplePriceText,
                                    {color: theme.highlightColor},
                                ]}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.informationView}>
                    <Ionicons
                        name="ios-location-sharp"
                        style={[
                            styles.iconLocation,
                            {color: Theme.common.commentGreen},
                        ]}
                    />
                    <StyleText
                        originValue={item.creatorLocation}
                        customStyle={[
                            styles.titleInformation,
                            {color: theme.textColor, fontWeight: 'normal'},
                        ]}
                    />
                </View>
            </>
        );
    };

    const ToolReaction = () => {
        return (
            <View
                style={[
                    styles.reactionView,
                    {borderTopColor: theme.holderColor},
                ]}>
                <View style={styles.starBox}>
                    {isLiked ? (
                        <IconLiked
                            customStyle={[
                                styles.star,
                                {color: theme.highlightColor},
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
                            touchableStyle={[
                                styles.starTouch,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}
                        />
                    ) : (
                        <IconNotLiked
                            customStyle={[
                                styles.star,
                                {color: theme.textColor},
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
                            touchableStyle={[
                                styles.starTouch,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}
                        />
                    )}
                    <StyleText
                        i18Text={
                            item.totalLikes
                                ? 'discovery.numberLike'
                                : 'discovery.like'
                        }
                        i18Params={{
                            value: item.totalLikes,
                        }}
                        customStyle={[
                            styles.textStar,
                            {color: theme.borderColor},
                        ]}
                        onPress={() => onShowModalComment('like')}
                    />
                </View>

                <View style={styles.starBox}>
                    <StyleTouchable
                        onPress={() => onShowModalComment('comment')}
                        customStyle={[
                            styles.starTouch,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}>
                        <StyleIcon
                            source={Images.icons.comment}
                            size={20}
                            customStyle={{tintColor: theme.textColor}}
                        />
                    </StyleTouchable>
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
                            styles.textStar,
                            {color: theme.borderColor},
                        ]}
                        onPress={() => onShowModalComment('comment')}
                    />
                </View>

                <View style={styles.starBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.starTouch,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        disable={disableShare}
                        onPress={() => onShowModalShare(item, setDisableShare)}>
                        <StyleIcon
                            source={Images.icons.share}
                            size={22}
                            customStyle={{tintColor: theme.textColor}}
                        />
                    </StyleTouchable>
                </View>
            </View>
        );
    };

    const ListPeopleBuying = () => {
        const isBiggerThanFive = listJoinedPaging.list.length > 5;
        const displayPeople = isBiggerThanFive
            ? listJoinedPaging.list.slice(0, 5)
            : listJoinedPaging.list;

        return (
            <>
                <StyleText
                    i18Text="discovery.numberPeopleJoin"
                    customStyle={[
                        styles.titleListPeopleBuying,
                        {color: theme.textHightLight},
                    ]}
                    i18Params={{
                        value: item.totalJoins,
                    }}
                    onPress={() => modalJoinedRef.current?.open()}
                />
                <StyleTouchable
                    customStyle={styles.peopleJoinView}
                    onPress={() => modalJoinedRef.current?.open()}>
                    {displayPeople.map((peopleJoin, index) => (
                        <StyleImage
                            key={peopleJoin.id}
                            source={{uri: peopleJoin.creatorAvatar}}
                            customStyle={[
                                styles.peopleJoinAvatar,
                                {marginLeft: index > 0 ? -5 : 0},
                            ]}
                        />
                    ))}
                    {isBiggerThanFive && (
                        <View
                            style={[
                                styles.peopleMoreBox,
                                {
                                    backgroundColor: theme.holderColor,
                                },
                            ]}>
                            <StyleImage
                                source={{
                                    uri: listJoinedPaging.list[5].creatorAvatar,
                                }}
                                customStyle={styles.avatarMore}
                            />
                            <StyleText
                                originValue={`+${
                                    listJoinedPaging.list.length -
                                    displayPeople.length
                                }`}
                                customStyle={[
                                    styles.textJoinMore,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </View>
                    )}
                </StyleTouchable>
            </>
        );
    };

    const Content = () => {
        return (
            <View
                style={[
                    styles.contentBox,
                    {borderTopColor: theme.holderColor},
                ]}>
                <View style={styles.creatorAvatarTouch}>
                    <StyleTouchable
                        customStyle={styles.creatorAvatar}
                        onPress={() => onGoToProfile(item.creator)}>
                        <StyleImage
                            source={{uri: item.creatorAvatar}}
                            customStyle={styles.creatorAvatar}
                        />
                    </StyleTouchable>
                    <View style={styles.nameTimeTouch}>
                        <StyleText
                            originValue={item.creatorName}
                            customStyle={[
                                styles.creatorNameText,
                                {color: theme.textColor},
                            ]}
                            numberOfLines={1}
                        />
                        <StyleText
                            originValue={formatFromNow(item.created)}
                            customStyle={[
                                styles.timeText,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                </View>
                <StyleText
                    originValue={item.content}
                    customStyle={[styles.textContent, {color: theme.textColor}]}
                />
            </View>
        );
    };

    return (
        <>
            <ScrollView
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}
                contentContainerStyle={styles.contentContainer}>
                <SharedElement id="image_group_buying" style={styles.imageView}>
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
                            }
                        }}
                        containerStyle={styles.imagePreview}
                    />
                </SharedElement>

                {Information()}
                {ToolReaction()}

                {!isMyBubble && (
                    <LinearGradient
                        colors={
                            hadJoined
                                ? [theme.holderColor, theme.holderColor]
                                : [
                                      Theme.common.gradientTabBar1,
                                      Theme.common.gradientTabBar2,
                                  ]
                        }
                        style={styles.groupBuyingBox}>
                        <StyleTouchable
                            customStyle={styles.touchGroupBuying}
                            onPress={onJoinGroupBuying}>
                            <StyleText
                                i18Text={
                                    hadJoined
                                        ? 'discovery.unJoinGroupBuying'
                                        : 'discovery.joinGroupBuying'
                                }
                                customStyle={[
                                    styles.textGroupBuying,
                                    {
                                        color: hadJoined
                                            ? theme.textHightLight
                                            : Theme.common.white,
                                    },
                                ]}
                            />
                        </StyleTouchable>
                    </LinearGradient>
                )}

                {ListPeopleBuying()}
                {Content()}
            </ScrollView>

            <StyleTouchable
                customStyle={[
                    styles.iconBackView,
                    {backgroundColor: theme.backgroundColor},
                ]}
                onPress={goBack}>
                <Ionicons
                    name="arrow-back"
                    style={[styles.iconBack, {color: theme.textColor}]}
                />
            </StyleTouchable>

            <ModalPeopleJoined
                ref={modalJoinedRef}
                postId={item.id}
                listPaging={listJoinedPaging}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: '30@vs',
    },
    imageView: {
        width: '100%',
    },
    imagePreview: {
        width: screenWidth,
        height: screenWidth * ratioImageGroupBuying,
    },
    iconBackView: {
        position: 'absolute',
        left: '10@s',
        top: '10@vs',
        padding: '5@ms',
        borderRadius: '20@ms',
    },
    iconBack: {
        fontSize: '20@ms',
    },
    avatar: {
        borderRadius: '30@s',
    },
    timeView: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5@vs',
        alignSelf: 'center',
    },
    textTime: {
        fontSize: FONT_SIZE.normal,
        marginRight: '17@s',
    },
    pricesView: {
        width: '80%',
        marginTop: '5@vs',
        alignSelf: 'center',
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    peoplePriceText: {
        fontSize: FONT_SIZE.normal,
        marginBottom: '5@vs',
    },
    informationView: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '15@vs',
        alignSelf: 'center',
    },
    titleInformation: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    reactionView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: '10@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingHorizontal: '40@s',
    },
    starBox: {
        alignItems: 'center',
        marginTop: '10@vs',
    },
    starTouch: {
        width: '50@ms',
        height: '50@ms',
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '25@ms',
    },
    star: {
        fontSize: '25@ms',
    },
    textStar: {
        fontSize: FONT_SIZE.small,
        marginTop: '10@vs',
    },
    groupBuyingBox: {
        width: '75%',
        backgroundColor: Theme.common.gradientTabBar1,
        alignSelf: 'center',
        marginTop: '15@vs',
        borderRadius: '10@ms',
    },
    touchGroupBuying: {
        width: '100%',
        paddingVertical: '5@vs',
        alignItems: 'center',
    },
    textGroupBuying: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    titleListPeopleBuying: {
        fontSize: FONT_SIZE.normal,
        marginTop: '15@vs',
        alignSelf: 'center',
    },
    peopleJoinView: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: '5@vs',
    },
    peopleJoinAvatar: {
        width: '35@s',
        height: '35@s',
        borderRadius: '20@s',
    },
    peopleMoreBox: {
        width: '35@s',
        height: '35@s',
        borderRadius: '20@s',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -5,
    },
    avatarMore: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '20@s',
        opacity: 0.2,
    },
    textJoinMore: {
        fontSize: FONT_SIZE.normal,
    },
    contentBox: {
        width: '85%',
        alignSelf: 'center',
        marginTop: '20@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    creatorAvatarTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    creatorAvatar: {
        width: '40@s',
        height: '40@s',
        borderRadius: '25@s',
    },
    nameTimeTouch: {
        flex: 1,
        paddingLeft: '10@s',
    },
    creatorNameText: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: FONT_SIZE.normal,
    },
    textContent: {
        fontSize: FONT_SIZE.normal,
        marginTop: '10@vs',
    },
    iconLocation: {
        fontSize: '20@ms',
    },
});

export default DetailGroupBuying;
