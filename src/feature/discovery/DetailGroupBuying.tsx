/* eslint-disable react-hooks/rules-of-hooks */
import {BlurView} from '@react-native-community/blur';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {apiGetListPeopleJoined, apiJoinGroupBuying} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {
    TypePeopleJoinedResponse,
    TypeShowModalCommentOrLike,
} from 'api/interface/discovery';
import {apiGetDetailBubble} from 'api/module';
import {
    apiCreateErrorLog,
    apiCreatePurchaseHistory,
    apiLikePost,
    apiUnLikePost,
} from 'api/profile';
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
    LIST_DEPOSIT_PRICES,
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
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ModalCommentLike from 'components/ModalCommentLike';
import ModalConfirmJoinGb from 'feature/common/components/ModalConfirmJoinGb';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useEffect, useRef, useState} from 'react';
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import appPurchase from 'utility/appPurchase';
import {
    fakeGroupBuying,
    logger,
    modeExpUsePaging,
    onGoToProfile,
    onGoToSignUp,
} from 'utility/assistant';
import {
    formatDayFromNow,
    formatDayGroupBuying,
    formatFromNow,
    formatLocaleNumber,
    isTimeBefore,
} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import ModalPeopleJoined from './components/ModalPeopleJoined';

interface Props {
    route: {
        params: {
            item?: TypeGroupBuying;
            itemId?: string;
            setList?: any;
            isFromTopGroupBuying?: boolean;
        };
        [key: string]: any;
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
    setList: any;
}) => {
    const {
        isModeExp,
        isLiked,
        setIsLiked,
        totalLikes,
        setTotalLikes,
        postId,
        setList,
    } = params;

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
            if (setList) {
                setList((preValue: Array<TypeGroupBuying>) => {
                    return preValue.map(value => {
                        if (value.id !== postId) {
                            return value;
                        }
                        return {
                            ...value,
                            isLiked: !currentLike,
                            totalLikes:
                                value.totalLikes + (currentLike ? -1 : 1),
                        };
                    });
                });
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
    const setList = route.params?.setList;
    const isInRoot = route.name === ROOT_SCREEN.detailGroupBuying;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const {profile} = Redux.getPassport();
    const isLoading = Redux.getIsLoading();

    const modalOptionRef = useRef<any>(null);
    const modalJoinedRef = useRef<Modalize>(null);
    const modalCommentLikeRef = useRef<ModalCommentLike>(null);
    const modalConfirmJoin = useRef<Modalize>(null);
    const [load, setLoad] = useState(false);
    const [item, setItem] = useState(route.params?.item || fakeGroupBuying);

    const chosenDeposit = useRef(LIST_DEPOSIT_PRICES[0]);

    const listJoinedPaging = !isModeExp
        ? usePaging({
              request: apiGetListPeopleJoined,
              params: {
                  postId: item.id || route.params?.itemId,
                  take: 10,
              },
          })
        : modeExpUsePaging();

    const {requestPurchase} = appPurchase({
        skus: LIST_DEPOSIT_PRICES.map(price => price.productId),
    });

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
    const [totalJoined, setTotalJoined] = useState(item.totalJoins);
    const [disableShare, setDisableShare] = useState(false);
    const [status, setStatus] = useState(item.status);

    const isMyBubble = item.relationship === RELATIONSHIP.self;
    const isExpired = isTimeBefore(item.endDate, new Date());

    const onRefresh = async () => {
        if (item) {
            try {
                setLoad(true);
                const res = await apiGetDetailBubble(item.id);
                const {data} = res;
                setItem(data);
                setIsLiked(data.isLiked);
                setTotalLikes(data.totalLikes);
                setTotalJoined(data.totalJoins);
                setStatus(data.status);
                listJoinedPaging.onRefresh();
            } catch (err) {
                appAlert(err);
            } finally {
                setLoad(false);
            }
        }
    };

    useEffect(() => {
        if (item.prices.length) {
            const standardPrice =
                Number(item.prices[item.prices.length - 1].value) * 0.2;
            const temp =
                LIST_DEPOSIT_PRICES.find(
                    price => price.value > standardPrice,
                ) || LIST_DEPOSIT_PRICES[LIST_DEPOSIT_PRICES.length - 1];
            chosenDeposit.current = temp;
        }
    }, [item.prices]);

    useEffect(() => {
        const getData = async () => {
            if (isModeExp) {
                return;
            }
            if (route.params.itemId) {
                try {
                    setLoad(true);
                    const res = await apiGetDetailBubble(route.params.itemId);
                    const {data} = res;
                    setItem(data);
                    setIsLiked(data.isLiked);
                    setTotalLikes(data.totalLikes);
                    setTotalJoined(data.totalJoins);
                    setStatus(data.status);
                } catch (err) {
                    appAlert(err);
                } finally {
                    setLoad(false);
                }
            }
        };
        getData();
    }, [isModeExp]);

    const onShowModalComment = (type: TypeShowModalCommentOrLike) => {
        if (isModeExp) {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
            });
        } else if (isInRoot) {
            modalCommentLikeRef.current?.show({
                post: item,
                type,
            });
        } else {
            showCommentDiscovery({
                post: item,
                type,
            });
        }
    };

    const onJoinGroupBuying = async () => {
        if (isModeExp || status !== GROUP_BUYING_STATUS.notJoined) {
            return;
        }

        try {
            modalConfirmJoin.current?.close();
            Redux.setIsLoading(true);
            const oldStatus = status;
            const oldListPeopleJoined = [...listJoinedPaging.list];
            await requestPurchase(chosenDeposit.current.productId);

            try {
                await apiCreatePurchaseHistory({
                    money: chosenDeposit.current.money,
                    postId: item.id,
                });

                let updateStatus = status;
                let updateTotalJoins = 0;
                setStatus(GROUP_BUYING_STATUS.joinedNotBought);
                listJoinedPaging.setList(
                    (preValue: Array<TypePeopleJoinedResponse>) => {
                        const temp: TypePeopleJoinedResponse = {
                            id: '',
                            creator: profile.id,
                            creatorName: profile.name,
                            creatorAvatar: profile.avatar,
                            created: String(new Date()),
                            status: null,
                            relationship: RELATIONSHIP.self,
                        };
                        return [temp].concat(preValue);
                    },
                );
                updateStatus = GROUP_BUYING_STATUS.joinedNotBought;
                updateTotalJoins = 1;
                await apiJoinGroupBuying(item.id);

                setTotalJoined(totalJoined + updateTotalJoins);
                setList((preValue: Array<TypeGroupBuying>) => {
                    return preValue.map(value => {
                        if (value.id !== item.id) {
                            return value;
                        }
                        return {
                            ...value,
                            totalJoins: value.totalJoins + updateTotalJoins,
                            status: updateStatus,
                        };
                    });
                });
            } catch (err) {
                setStatus(oldStatus);
                listJoinedPaging.setList(oldListPeopleJoined);
                await apiCreateErrorLog(
                    `Error when deposit, gb: ${item.id}, money: ${chosenDeposit.current.money}`,
                );
                appAlert(err);
            }
        } catch (err) {
            logger(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    /**
     * Render views
     */
    const Information = () => {
        const chooseTextRemaining = () => {
            const dayRemaining = formatDayFromNow(item.deadlineDate);
            if (dayRemaining > 0) {
                return (
                    <StyleText
                        i18Text="discovery.dayRemain"
                        i18Params={{
                            value: formatDayFromNow(item.deadlineDate),
                        }}
                        customStyle={[
                            styles.textTime,
                            {
                                color: isExpired
                                    ? Theme.common.red
                                    : theme.textColor,
                            },
                        ]}
                    />
                );
            }

            if (dayRemaining === 0) {
                return (
                    <StyleText
                        i18Text="discovery.today"
                        customStyle={[
                            styles.textTime,
                            {
                                color: Theme.common.red,
                                fontWeight: 'bold',
                            },
                        ]}
                    />
                );
            }

            return null;
        };

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
                        originValue={formatDayGroupBuying(item.endDate)}
                        customStyle={[
                            styles.textTime,
                            {
                                color: isExpired
                                    ? Theme.common.red
                                    : theme.textColor,
                            },
                        ]}
                    />
                </View>

                <TitleInformation
                    icon={Images.icons.deadline}
                    title="profile.subscriptionDeadline"
                    titleColor={theme.textHightLight}
                />
                <View style={styles.timeView}>
                    <StyleText
                        originValue={formatDayGroupBuying(item.deadlineDate)}
                        customStyle={[
                            styles.textTime,
                            {color: theme.textColor},
                        ]}
                    />
                    {!isExpired && (
                        <>
                            <StyleText
                                originValue=":"
                                customStyle={[
                                    styles.textTime,
                                    {color: theme.borderColor},
                                ]}
                            />
                            {chooseTextRemaining()}
                        </>
                    )}
                </View>

                <TitleInformation
                    icon={Images.icons.dollar}
                    title="discovery.groupBuyingPrice"
                    titleColor={theme.textHightLight}
                />
                <View style={styles.pricesView}>
                    {item.prices.map((price, index) => (
                        <View key={index} style={styles.priceBox}>
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
                                originValue={`${formatLocaleNumber(
                                    price.value,
                                )} vnd`}
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
                                    setList,
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
                                {color: theme.unLikeHeart},
                            ]}
                            onPress={() =>
                                onHandleLike({
                                    isModeExp,
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                    setList,
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
                            totalLikes
                                ? 'discovery.numberLike'
                                : 'discovery.like'
                        }
                        i18Params={{
                            value: totalLikes,
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
                    i18Text={
                        totalJoined
                            ? 'discovery.numberPeopleJoin'
                            : 'discovery.beTheFirstJoin'
                    }
                    customStyle={[
                        styles.titleListPeopleBuying,
                        {color: theme.textHightLight},
                    ]}
                    i18Params={{
                        value: totalJoined,
                    }}
                    onPress={() => modalJoinedRef.current?.open()}
                />
                <StyleTouchable
                    customStyle={styles.peopleJoinView}
                    onPress={() => modalJoinedRef.current?.open()}>
                    {displayPeople.map(
                        (
                            peopleJoin: TypePeopleJoinedResponse,
                            index: number,
                        ) => (
                            <StyleImage
                                key={index}
                                source={{uri: peopleJoin.creatorAvatar}}
                                customStyle={[
                                    styles.peopleJoinAvatar,
                                    {marginLeft: index > 0 ? -5 : 0},
                                ]}
                            />
                        ),
                    )}
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

    const ButtonCheckJoin = () => {
        if (isMyBubble) {
            return null;
        }
        if (status === GROUP_BUYING_STATUS.bought) {
            return (
                <>
                    <StyleIcon
                        source={Images.images.successful}
                        size={60}
                        customStyle={styles.iconSuccessfully}
                    />
                    <StyleText
                        i18Text="discovery.thanksForJoin"
                        customStyle={[
                            styles.textSuccessfully,
                            {color: theme.highlightColor},
                        ]}
                    />
                </>
            );
        }

        if (
            [
                GROUP_BUYING_STATUS.notJoined,
                GROUP_BUYING_STATUS.joinedNotBought,
            ].includes(status)
        ) {
            const hadDeposited = status === GROUP_BUYING_STATUS.joinedNotBought;
            const colorGradient = hadDeposited
                ? [Theme.common.orange, Theme.common.orange]
                : [Theme.common.gradientTabBar1, Theme.common.gradientTabBar2];
            return (
                <>
                    <LinearGradient
                        colors={colorGradient}
                        style={[
                            styles.groupBuyingBox,
                            {opacity: isExpired ? 0.5 : 1},
                        ]}>
                        <StyleTouchable
                            customStyle={styles.touchGroupBuying}
                            onPress={() => modalConfirmJoin.current?.open()}
                            disable={isExpired || hadDeposited}
                            disableOpacity={1}>
                            <StyleText
                                i18Text={
                                    hadDeposited
                                        ? 'discovery.deposited'
                                        : 'discovery.joinGroupBuying'
                                }
                                customStyle={styles.textGroupBuying}
                            />
                        </StyleTouchable>
                    </LinearGradient>

                    {isExpired && (
                        <StyleText
                            i18Text="discovery.gbExpired"
                            customStyle={styles.expiredText}
                        />
                    )}
                </>
            );
        }

        return null;
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
                            onPress={() => onGoToProfile(item.creator)}
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
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={load}
                        onRefresh={onRefresh}
                        tintColor={theme.highlightColor}
                        colors={[theme.highlightColor]}
                    />
                }
                showsVerticalScrollIndicator={false}>
                <SharedElement
                    id={`item.group_buying.${item.id}.${!!route.params
                        ?.isFromTopGroupBuying}`}
                    style={styles.imageView}>
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
                                    setList,
                                });
                            }
                        }}
                        containerStyle={styles.imagePreview}
                    />

                    {isMyBubble && (
                        <StyleTouchable
                            customStyle={styles.iconOptionView}
                            onPress={() => modalOptionRef.current?.show()}>
                            <BlurView
                                style={StyleSheet.absoluteFill}
                                blurType="ultraThinMaterialLight"
                                blurAmount={3}
                                blurRadius={20}
                            />
                            <StyleIcon source={Images.icons.more} size={15} />
                        </StyleTouchable>
                    )}
                </SharedElement>

                {Information()}
                {ToolReaction()}
                {ButtonCheckJoin()}
                {ListPeopleBuying()}
                {Content()}
            </ScrollView>

            <StyleTouchable customStyle={styles.iconBackView} onPress={goBack}>
                <BlurView
                    style={StyleSheet.absoluteFill}
                    blurType="ultraThinMaterialLight"
                    blurAmount={3}
                    blurRadius={20}
                />
                <Ionicons name="arrow-back" style={styles.iconBack} />
            </StyleTouchable>

            {!isModeExp && (
                <ModalPeopleJoined
                    ref={modalJoinedRef}
                    postId={item.id}
                    listPaging={listJoinedPaging}
                    isMyBubble={isMyBubble}
                />
            )}

            <ModalCommentLike
                ref={modalCommentLikeRef}
                theme={theme}
                bubbleFocusing={item}
                updateBubbleFocusing={(value: TypeGroupBuying) => {
                    setItem({
                        ...item,
                        ...value,
                    });
                }}
                setTotalComments={value =>
                    setItem(preValue => {
                        if (preValue) {
                            return {
                                ...preValue,
                                totalComments: value,
                            };
                        }
                        return preValue;
                    })
                }
                increaseTotalComments={value => {
                    setItem(preValue => {
                        if (preValue) {
                            return {
                                ...preValue,
                                totalComments: preValue.totalComments + value,
                            };
                        }
                        return preValue;
                    });
                }}
            />
            <ModalConfirmJoinGb
                ref={modalConfirmJoin}
                onConfirm={onJoinGroupBuying}
                money={chosenDeposit.current.money}
            />

            {isLoading && <LoadingScreen />}

            <StyleActionSheet
                ref={modalOptionRef}
                listTextAndAction={[
                    {
                        text: 'profile.post.edit',
                        action: () =>
                            navigate(PROFILE_ROUTE.createGroupBuying, {
                                itemEdit: item,
                            }),
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
    },
    iconBackView: {
        position: 'absolute',
        left: '10@s',
        top: Metrics.safeTopPadding,
        padding: '5@ms',
        borderRadius: '15@ms',
    },
    iconBack: {
        fontSize: '20@ms',
        color: Theme.common.white,
    },
    iconOptionView: {
        position: 'absolute',
        right: '10@s',
        top: Metrics.safeTopPadding,
        paddingHorizontal: '7@ms',
        borderRadius: '15@ms',
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
        fontSize: FONT_SIZE.small,
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
        fontSize: FONT_SIZE.small,
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
    expiredText: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.red,
        alignSelf: 'center',
        marginTop: '5@vs',
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
        width: '40@ms',
        height: '40@ms',
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
    iconSuccessfully: {
        alignSelf: 'center',
        marginTop: '20@vs',
    },
    textSuccessfully: {
        fontSize: FONT_SIZE.small,
        alignSelf: 'center',
    },
});

export default DetailGroupBuying;
