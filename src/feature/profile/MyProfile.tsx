import {useIsFocused, useRoute} from '@react-navigation/native';
import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {
    apiGetListGBJoined,
    apiGetListPostsLiked,
    apiGetProfile,
} from 'api/module';
import {
    apiGetListGroupBuying,
    apiGetListReviewAboutUser,
    apiLikePost,
    apiUnLikePost,
} from 'api/profile';
import {ACCOUNT, POST_TYPE, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import LoadingIndicator from 'components/common/LoadingIndicator';
import StyleActionSheet from 'components/common/StyleActionSheet';
import StyleTabView from 'components/StyleTabView';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Bubble from 'feature/discovery/components/Bubble';
import BubbleGroupBuying, {
    ParamsLikeGB,
} from 'feature/discovery/components/BubbleGroupBuying';
import ListShareElement from 'feature/profile/post/ListShareElement';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {tabBarViewHeight} from 'navigation/components/TabNavigator';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Animated,
    NativeScrollEvent,
    Platform,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
    isScrollCloseToBottom,
    modalizeMyProfile,
    modalizeMyProfileShop,
    onGoToSignUp,
} from 'utility/assistant';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting, {
    searchSettingHeight,
} from './components/SearchAndSetting';
import ToolMyProfile, {toolProfileHeight} from './components/ToolMyProfile';

const {width, safeBottomPadding} = Metrics;

/** ------------------------
 * Profile Enjoy
 * -------------------------
 */
const ProfileEnjoy = () => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();

    const optionRef = useRef<any>(null);

    const onShowOption = () => {
        optionRef.current.show();
    };

    return (
        <>
            <ViewSafeTopPadding />
            <View style={{flex: 1}}>
                <SearchAndSetting
                    onShowOptions={onShowOption}
                    hasBackBtn={false}
                    hasGuideButton
                />

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <InformationProfile profile={profile} />
                    <ToolMyProfile
                        index={0}
                        onChangeTab={() => null}
                        isShopAccount={false}
                    />
                    <View style={styles.signUpBox}>
                        <StyleImage
                            customStyle={styles.imageTellSignUp}
                            source={Images.images.signUpNow}
                            resizeMode="contain"
                        />

                        <StyleTouchable
                            customStyle={[
                                styles.buttonTellSignUp,
                                {backgroundColor: theme.highlightColor},
                            ]}
                            onPress={onGoToSignUp}>
                            <StyleText
                                i18Text="profile.component.infoProfile.tellSignUp"
                                customStyle={[
                                    styles.textTellSignUp,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                </ScrollView>
            </View>

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
            />
        </>
    );
};

/** ------------------------
 * Profile User
 * -------------------------
 */
const safeLoadMoreStyle: any = {
    overflow: 'hidden',
    height:
        Metrics.height -
        tabBarViewHeight -
        toolProfileHeight -
        searchSettingHeight, // check to remove this
};

let modalBubbleOption: TypeBubblePalace | TypeGroupBuying;

const onHandleLike = async (params: ParamsLikeGB, setList: any) => {
    const {isLiked, setIsLiked, totalLikes, setTotalLikes, postId} = params;
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

        setList((preValue: Array<TypeGroupBuying>) => {
            return preValue.map(value => {
                if (value.id !== postId) {
                    return value;
                }
                return {
                    ...value,
                    isLiked: !currentLike,
                    totalLikes: value.totalLikes + (currentLike ? -1 : 1),
                };
            });
        });
    } catch (err) {
        setIsLiked(currentLike);
        setTotalLikes(currentNumberLikes);
        appAlert(err);
    }
};

const ProfileAccount = () => {
    const route = useRoute();
    const isFocused = useIsFocused();

    const {profile} = Redux.getPassport();
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const theme = Redux.getTheme();
    const isShopAccount = profile.account_type === ACCOUNT.shop;
    const isInTabProfile = route.name === PROFILE_ROUTE.myProfile;

    const checkIsFocus = useRef(true);
    const listCheckTabLazy = useRef<Array<boolean>>([
        true,
        false,
        false,
        false,
    ]);

    const myGbPaging = usePaging({
        request: apiGetListGroupBuying,
        params: {
            userId: profile.id,
        },
    });
    const postsLikedPaging = usePaging({
        request: apiGetListPostsLiked,
        isInitNotRunRequest: true,
    });
    const gbJoinedPaging = usePaging({
        request: apiGetListGBJoined,
        isInitNotRunRequest: true,
    });
    const postReviewPaging = usePaging({
        request: apiGetListReviewAboutUser,
        isInitNotRunRequest: true,
        params: {
            userId: profile.id,
        },
    });

    const initIndex = useRef(isShopAccount ? 0 : 1).current;
    const translateXIndicator = useRef(
        new Animated.Value(initIndex * (width / 4)),
    ).current;
    const optionRef = useRef<any>(null);
    const optionPostReviewRef = useRef<any>(null);
    const myPostRef = useRef<ListShareElement>(null);
    const postLikedRef = useRef<ListShareElement>(null);
    const postSavedRef = useRef<ListShareElement>(null);
    const tabFourSharedRef = useRef<ListShareElement>(null);
    const tabViewRef = useRef<StyleTabView>(null);
    const scrollRef = useRef<ScrollView>(null);

    const [tabIndex, setTabIndex] = useState(initIndex);
    const [postIdFocusing, setPostIdFocusing] = useState('');
    const isFocusMyPost = tabIndex === 0;
    const isFocusPostLiked = tabIndex === 1;
    const isFocusPostSaved = tabIndex === 2;
    const isFocusGbJoined = tabIndex === 3;

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewPost
        ) {
            myGbPaging.setList((preValue: Array<TypeBubblePalace>) =>
                [bubblePalaceAction.payload].concat(preValue),
            );
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editPostFromProfile
        ) {
            myGbPaging.setList((preValue: Array<TypeBubblePalace>) =>
                preValue.map(item => {
                    if (item.id !== bubblePalaceAction.payload.id) {
                        return item;
                    }
                    return {
                        ...item,
                        ...bubblePalaceAction.payload,
                    };
                }),
            );
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        } else if (
            checkIsFocus &&
            bubblePalaceAction.action ===
                TYPE_BUBBLE_PALACE_ACTION.scrollToTopMyProfile
        ) {
            if (myPostRef.current?.isShowing()) {
                myPostRef.current?.hide();
            } else if (postLikedRef.current?.isShowing()) {
                postLikedRef.current?.hide();
            } else if (postSavedRef.current?.isShowing()) {
                postSavedRef.current?.hide();
            } else if (tabFourSharedRef.current?.isShowing()) {
                tabFourSharedRef.current?.hide();
            } else {
                scrollRef.current?.scrollTo({
                    y: 0,
                    animated: true,
                });
            }
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        } else if (
            bubblePalaceAction.action === TYPE_BUBBLE_PALACE_ACTION.archivePost
        ) {
            const postArchived: TypeBubblePalace = bubblePalaceAction.payload;

            myGbPaging.setList(preValue =>
                preValue.filter(item => {
                    if (item.id !== postArchived.id) {
                        return true;
                    }
                    return false;
                }),
            );

            if (listCheckTabLazy.current[1]) {
                postsLikedPaging.setList(preValue =>
                    preValue.filter(item => {
                        if (item.id !== postArchived.id) {
                            return true;
                        }
                        return false;
                    }),
                );
            }
            if (listCheckTabLazy.current[2]) {
                gbJoinedPaging.setList(preValue =>
                    preValue.filter(item => {
                        if (item.id !== postArchived.id) {
                            return true;
                        }
                        return false;
                    }),
                );
            }

            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.unArchivePost
        ) {
            const archivedPost: TypeBubblePalace = bubblePalaceAction.payload;
            myGbPaging.setList(preValue => [archivedPost].concat(preValue));
            if (archivedPost.isLiked) {
                postsLikedPaging.setList(preValue =>
                    [archivedPost].concat(preValue),
                );
            }
            if (archivedPost.isSaved) {
                gbJoinedPaging.setList(preValue =>
                    [archivedPost].concat(preValue),
                );
            }
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        }
    }, [bubblePalaceAction]);

    useEffect(() => {
        let x: any;
        if (!isFocused) {
            checkIsFocus.current = false;
        } else {
            x = setTimeout(() => {
                checkIsFocus.current = true;
            }, 200);
        }
        return () => {
            clearTimeout(x);
        };
    }, [isFocused]);

    /**
     * Functions
     */
    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(profile.id);
            Redux.updatePassport({
                profile: res.data,
            });

            if (isFocusMyPost) {
                myGbPaging.onRefresh();
            } else if (isFocusPostLiked) {
                postsLikedPaging.onRefresh();
            } else if (isFocusPostSaved) {
                gbJoinedPaging.onRefresh();
            } else if (isFocusGbJoined) {
                postReviewPaging.onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const checkScrollEnd = (nativeEvent: NativeScrollEvent) => {
        if (isScrollCloseToBottom(nativeEvent)) {
            if (isFocusMyPost) {
                myGbPaging.onLoadMore();
            } else if (isFocusPostLiked) {
                postsLikedPaging.onLoadMore();
            } else if (isFocusPostSaved) {
                gbJoinedPaging.onLoadMore();
            } else if (isFocusGbJoined) {
                postReviewPaging.onLoadMore();
            }
        }

        if (isFocusMyPost) {
            myPostRef.current?.scrollToNearingEnd();
        } else if (isFocusPostLiked) {
            postLikedRef.current?.scrollToNearingEnd();
        } else if (isFocusPostSaved) {
            postSavedRef.current?.scrollToNearingEnd();
        }
    };

    /**
     * Render views
     */
    const RenderItemMyGb = useCallback(
        (item: TypeGroupBuying) => {
            return (
                <BubbleGroupBuying
                    item={item}
                    onGoToDetailGroupBuying={() => {
                        navigate(PROFILE_ROUTE.detailGroupBuying, {
                            item,
                            setList: myGbPaging.setList,
                        });
                    }}
                    onShowMoreOption={() => null}
                    onHandleLike={() => null}
                    onShowModalComment={() => null}
                    onChangePostIdFocusing={() => null}
                    detailGroupTarget={PROFILE_ROUTE.detailGroupBuying}
                    containerWidth={isShopAccount ? width * 0.485 : width * 0.9}
                    showReactView={!isShopAccount}
                    showTopView={!isShopAccount}
                    showBottomView={!isShopAccount}
                    showButtonJoined={!isShopAccount}
                    containerStyle={
                        isShopAccount
                            ? {
                                  marginVertical: width * 0.01,
                              }
                            : {}
                    }
                />
            );
        },
        [isShopAccount],
    );

    const RenderItemGbFavoriteJoined = useCallback(
        (item: TypeGroupBuying, setList: any) => {
            if (item.postType === POST_TYPE.groupBuying) {
                return (
                    <BubbleGroupBuying
                        item={item}
                        onGoToDetailGroupBuying={() => {
                            navigate(PROFILE_ROUTE.detailGroupBuying, {
                                item,
                                setList,
                            });
                        }}
                        onShowMoreOption={() => null}
                        onHandleLike={params => onHandleLike(params, setList)}
                        onShowModalComment={(post, type) =>
                            showCommentDiscovery({
                                post,
                                type,
                                setList,
                            })
                        }
                        onChangePostIdFocusing={() => null}
                        detailGroupTarget={PROFILE_ROUTE.detailGroupBuying}
                        containerWidth={width * 0.9}
                    />
                );
            }
            return null;
        },
        [isShopAccount],
    );

    const RenderItemReview = useCallback(
        (item: TypeBubblePalace) => {
            return (
                <Bubble
                    item={item}
                    onShowMoreOption={params => {
                        modalBubbleOption = params.postModal;
                        optionPostReviewRef.current?.show();
                    }}
                    onShowModalComment={(post, type) =>
                        showCommentDiscovery({
                            post,
                            type,
                            setList: postReviewPaging.setList,
                        })
                    }
                    isFocusing={item.id === postIdFocusing}
                    onChangePostIdFocusing={postId => setPostIdFocusing(postId)}
                />
            );
        },
        [postIdFocusing],
    );

    return (
        <>
            <ViewSafeTopPadding />
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <SearchAndSetting
                    onShowOptions={() => optionRef.current.show()}
                    hasBackBtn={!isInTabProfile}
                    hasGuideButton={isInTabProfile}
                />
                <ScrollView
                    ref={scrollRef}
                    stickyHeaderIndices={[1]}
                    onMomentumScrollEnd={({nativeEvent}) => {
                        checkScrollEnd(nativeEvent);
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={!!myGbPaging.refreshing}
                            onRefresh={onRefreshPage}
                            tintColor={theme.highlightColor}
                            colors={[theme.highlightColor]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: isInTabProfile ? 0 : safeBottomPadding,
                    }}>
                    <InformationProfile profile={profile} />
                    <>
                        <ToolMyProfile
                            index={tabIndex}
                            onChangeTab={index => {
                                setTabIndex(index);
                                tabViewRef.current?.navigateToIndex(index);
                            }}
                            isShopAccount={isShopAccount}
                        />
                        <View
                            style={[
                                styles.indicatorView,
                                {backgroundColor: theme.backgroundColor},
                            ]}>
                            <Animated.View
                                style={[
                                    styles.indicator,
                                    {
                                        flex: 1 / 4,
                                        transform: [
                                            {translateX: translateXIndicator},
                                        ],
                                    },
                                ]}>
                                <View
                                    style={[
                                        styles.indicatorIn,
                                        {
                                            borderTopColor: theme.borderColor,
                                        },
                                    ]}
                                />
                            </Animated.View>
                        </View>
                    </>

                    <StyleTabView
                        ref={tabViewRef}
                        onFirstNavigateToIndex={index => {
                            listCheckTabLazy.current[index] = true;
                            if (index === 1) {
                                postsLikedPaging.onLoadMore();
                            } else if (index === 2) {
                                gbJoinedPaging.onLoadMore();
                            } else if (index === 3) {
                                if (isShopAccount) {
                                    postReviewPaging.onLoadMore();
                                }
                            }
                        }}
                        initIndex={initIndex}
                        onScroll={e => {
                            translateXIndicator.setValue(e.position * width);
                            if (e.index !== tabIndex) {
                                setTabIndex(e.index);
                            }
                        }}>
                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusMyPost ? {} : safeLoadMoreStyle,
                                {
                                    justifyContent: isShopAccount
                                        ? 'space-between'
                                        : 'center',
                                },
                            ]}>
                            {myGbPaging.list.map(RenderItemMyGb)}
                            {myGbPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>
                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusPostLiked ? {} : safeLoadMoreStyle,
                            ]}>
                            {postsLikedPaging.list.map(item =>
                                RenderItemGbFavoriteJoined(
                                    item,
                                    postsLikedPaging.setList,
                                ),
                            )}
                            {postsLikedPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>
                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusPostSaved ? {} : safeLoadMoreStyle,
                            ]}>
                            {gbJoinedPaging.list.map(item =>
                                RenderItemGbFavoriteJoined(
                                    item,
                                    gbJoinedPaging.setList,
                                ),
                            )}
                            {gbJoinedPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>
                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusGbJoined ? {} : safeLoadMoreStyle,
                            ]}>
                            {isShopAccount
                                ? postReviewPaging.list.map(item =>
                                      RenderItemReview(item),
                                  )
                                : null}
                            {postReviewPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>
                    </StyleTabView>
                </ScrollView>

                <StyleActionSheet
                    ref={optionRef}
                    listTextAndAction={
                        isShopAccount
                            ? modalizeMyProfileShop
                            : modalizeMyProfile
                    }
                />

                <StyleActionSheet
                    ref={optionPostReviewRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.report.title',
                            action: () => {
                                if (modalBubbleOption) {
                                    navigate(ROOT_SCREEN.reportUser, {
                                        idUser: modalBubbleOption.creator,
                                        nameUser: modalBubbleOption.creatorName,
                                    });
                                }
                            },
                        },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            </View>
        </>
    );
};

/**
 * BOSS HERE
 */
const MyProfile = () => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    if (!isModeExp && token) {
        return <ProfileAccount />;
    }
    return <ProfileEnjoy />;
};

const styles = ScaledSheet.create({
    contentContainer: {
        paddingBottom: '100@vs',
        flexGrow: 1,
    },
    signUpBox: {
        width: '100%',
        height: '100@s',
        marginTop: '20@vs',
    },
    imageTellSignUp: {
        position: 'absolute',
        right: '30@s',
        width: '100@s',
        height: '100@s',
    },
    buttonTellSignUp: {
        position: 'absolute',
        right: '140@s',
        top: '50@s',
        paddingHorizontal: '30@vs',
        paddingVertical: '8@vs',
        borderRadius: '50@vs',
    },
    textTellSignUp: {
        fontSize: '15@ms',
    },
    contentContainerPost: {
        width,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: '2@s',
    },
    itemPostView: {
        marginHorizontal: '0.25@ms',
    },
    // input
    inputCommentView: {
        paddingBottom: '14@vs',
    },
    // indicator
    indicatorView: {
        width: '100%',
        flexDirection: 'row',
    },
    indicator: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    indicatorIn: {
        width: '60%',
        borderTopWidth: Platform.select({
            ios: '1.5@ms',
            android: '2@ms',
        }),
    },
});

export default MyProfile;
