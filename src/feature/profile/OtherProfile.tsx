import {
    TypeBubblePalace,
    TypeGetProfileResponse,
    TypeGroupBuying,
} from 'api/interface';
import {
    apiBlockUser,
    apiFollowUser,
    apiGetListPost,
    apiGetProfile,
    apiUnFollowUser,
} from 'api/module';
import {apiGetListReviewAboutUser} from 'api/profile';
import {ACCOUNT, RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import LoadingIndicator from 'components/common/LoadingIndicator';
import NoData from 'components/common/NoData';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ModalCommentLike from 'components/ModalCommentLike';
import StyleTabView from 'components/StyleTabView';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
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
    fakeBubbleFocusing,
    interactBubble,
    isScrollCloseToBottom,
} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import ToolOtherProfile from './components/ToolOtherProfile';
import MyListGroupBuying from './MyListGroupBuying';
import ListShareElement from './post/ListShareElement';
import PostStatus from './post/PostStatus';

interface Props {
    route: {
        params: {
            id: number;
            onGoBack(): void;
        };
        [key: string]: any;
    };
}

const {width} = Metrics;

const onBlockUser = async (userId: number) => {
    try {
        await apiBlockUser(userId);
    } catch (err) {
        appAlert(err);
    }
};
const onReport = async (userId: number, userName: string) => {
    navigate(ROOT_SCREEN.reportUser, {
        idUser: userId,
        nameUser: userName,
    });
};

const onSendMessage = (profile: any) => {
    if (profile) {
        interactBubble({
            userId: profile.id,
            name: profile.name,
            avatar: profile.avatar,
        });
    }
};

const OtherProfile = ({route}: Props) => {
    const {id, onGoBack} = route.params;
    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();

    const theme = Redux.getTheme();
    const isLoading = Redux.getIsLoading();

    const modalRef = useRef<ModalCommentLike>(null);
    const optionsRef = useRef<any>(null);
    const actionReviewRef = useRef<any>(null);
    const tabViewRef = useRef<StyleTabView>(null);
    const listUserPostsRef = useRef<ListShareElement>(null);
    const listPostReviewRef = useRef<ListShareElement>(null);
    const translateXIndicator = useRef(new Animated.Value(0)).current;
    const listPosts = useRef<Array<TypeBubblePalace>>([]);
    const tabIndexRef = useRef(0);

    const [profile, setProfile] = useState<TypeGetProfileResponse>();
    const [isFollowing, setIsFollowing] = useState(false);
    const [bubbleFocusing, setBubbleFocusing] = useState<TypeBubblePalace>();
    const [tabIndex, setTabIndex] = useState(0);

    const isBlock = profile?.relationship === RELATIONSHIP.block;
    const isShopAccount = profile?.account_type === ACCOUNT.shop;
    const isFocusListPost = tabIndex === 0;
    const isFocusPostReviewed = tabIndex === 1;

    const listPostsPaging = usePaging({
        request: apiGetListPost,
        params: {
            userId: id,
        },
    });
    const listPostsReviewAbout = usePaging({
        request: apiGetListReviewAboutUser,
        params: {
            userId: id,
        },
        isInitNotRunRequest: true,
    });

    const getData = async () => {
        try {
            Redux.setIsLoading(true);
            const res = await apiGetProfile(id);
            setIsFollowing(res.data.relationship === RELATIONSHIP.following);
            setProfile(res.data);
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tabIndex === 0) {
            listPosts.current = listPostsPaging.list;
        } else if (tabIndex === 1) {
            listPosts.current = listPostsReviewAbout.list;
        }
        tabIndexRef.current = tabIndex;
    }, [tabIndex, listPostsPaging.list, listPostsReviewAbout.list]);

    useEffect(() => {
        getData();
    }, [shouldRenderOtherProfile]);

    const onHandleFollow = async () => {
        if (profile) {
            const currentFollow = isFollowing;
            const currentFollowers = profile.followers;
            try {
                setIsFollowing(!currentFollow);
                setProfile({
                    ...profile,
                    followers: currentFollowers + (currentFollow ? -1 : 1),
                });
                if (currentFollow) {
                    await apiUnFollowUser(id);
                } else {
                    await apiFollowUser(id);
                }
            } catch (err) {
                setIsFollowing(currentFollow);
                setProfile({
                    ...profile,
                    followers: currentFollowers,
                });
                appAlert(err);
            }
        }
    };

    const onShowOption = () => {
        if (isBlock) {
            return;
        }
        optionsRef.current?.show();
    };

    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(id);
            setIsFollowing(res.data.relationship === RELATIONSHIP.following);
            setProfile(res.data);

            if (isFocusListPost) {
                listPostsPaging.onRefresh();
            } else if (isFocusPostReviewed) {
                listPostsReviewAbout.onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onGoToDetailPost = (bubbleId: string) => {
        const initIndex = listPosts.current.findIndex(
            item => item.id === bubbleId,
        );
        if (tabIndexRef.current === 0) {
            listUserPostsRef.current?.show({
                index: initIndex === -1 ? 0 : initIndex,
                postId: bubbleId,
            });
        } else if (tabIndexRef.current === 1) {
            listPostReviewRef.current?.show({
                index: initIndex === -1 ? 0 : initIndex,
                postId: bubbleId,
            });
        }
    };

    const checkScrollEnd = (nativeEvent: NativeScrollEvent) => {
        if (isScrollCloseToBottom(nativeEvent)) {
            if (isFocusListPost) {
                listPostsPaging.onLoadMore();
            }
        }
        if (isFocusListPost) {
            listUserPostsRef.current?.scrollToNearingEnd();
        }
    };

    /**
     * Render_view
     */
    const RenderItemPost = useCallback(
        (item: TypeBubblePalace & TypeGroupBuying) => {
            return (
                <PostStatus
                    key={item.id}
                    item={item}
                    onGoToDetailPost={onGoToDetailPost}
                    containerStyle={styles.postStatusView}
                />
            );
        },
        [],
    );

    if (isBlock) {
        return (
            <>
                <AvatarBackground avatar={profile?.avatar || ''} />
                <View
                    style={[
                        styles.overlayView,
                        {backgroundColor: theme.backgroundColor},
                    ]}
                />
                <ViewSafeTopPadding />
                <SearchAndSetting
                    onShowOptions={onShowOption}
                    hasSettingBtn={false}
                    onGoBack={onGoBack}
                />
                <NoData content="No Data" />
            </>
        );
    }

    const Header = () => {
        return (
            <>
                {!!profile && <InformationProfile profile={profile} />}
                <View
                    style={[
                        styles.btnInteractView,
                        {
                            backgroundColor: theme.backgroundColor,
                            borderBottomColor: theme.holderColor,
                        },
                    ]}>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonInteract,
                            {
                                backgroundColor: theme.backgroundButtonColor,
                                flex: isFollowing ? 0.6 : 1.5,
                            },
                        ]}
                        onPress={onHandleFollow}
                        disable={isFollowing}
                        disableOpacity={1}>
                        <StyleText
                            i18Text={
                                isFollowing
                                    ? 'profile.component.infoProfile.following'
                                    : 'profile.screen.follow'
                            }
                            customStyle={[
                                styles.textInteract,
                                {
                                    color: isFollowing
                                        ? theme.textColor
                                        : theme.highlightColor,
                                    fontWeight: 'bold',
                                },
                            ]}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={[
                            styles.buttonInteract,
                            {
                                backgroundColor: theme.backgroundButtonColor,
                            },
                        ]}
                        onPress={() => onSendMessage(profile)}>
                        <StyleText
                            i18Text="profile.screen.sendMessage"
                            customStyle={[
                                styles.textInteract,
                                {
                                    color: theme.textHightLight,
                                },
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </>
        );
    };

    const Indicator = () => {
        return (
            <View
                style={[
                    styles.indicatorView,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            flex: 1 / 3,
                            borderTopColor: theme.borderColor,
                            transform: [{translateX: translateXIndicator}],
                        },
                    ]}
                />
            </View>
        );
    };

    return (
        <>
            <AvatarBackground avatar={profile?.avatar || ''} />
            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
            <ViewSafeTopPadding />

            <SearchAndSetting
                onShowOptions={onShowOption}
                hasSettingBtn={false}
                onGoBack={onGoBack}
            />

            <View style={{flex: 1}}>
                <ScrollView
                    onMomentumScrollEnd={({nativeEvent}) => {
                        checkScrollEnd(nativeEvent);
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={!!listPostsPaging.refreshing}
                            onRefresh={onRefreshPage}
                            tintColor={theme.highlightColor}
                            colors={[theme.highlightColor]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    stickyHeaderIndices={[1]}>
                    {Header()}
                    <ToolOtherProfile
                        index={tabIndex}
                        onChangeTab={index => {
                            setTabIndex(index);
                            tabViewRef.current?.navigateToIndex(index);
                        }}
                        disableReview={!isShopAccount}
                        onShowModalReview={() =>
                            actionReviewRef.current?.show()
                        }
                    />

                    {Indicator()}

                    <StyleTabView
                        ref={tabViewRef}
                        onFirstNavigateToIndex={index => {
                            if (index === 1 && isShopAccount) {
                                listPostsReviewAbout.onLoadMore();
                            }
                        }}
                        onScroll={e => {
                            translateXIndicator.setValue(
                                (e.position * width * 2) / 3,
                            );
                            if (e.index !== tabIndex) {
                                setTabIndex(e.index);
                            }
                        }}>
                        <View style={styles.tabView}>
                            {isShopAccount && (
                                <MyListGroupBuying
                                    userId={profile.id}
                                    onTouchStart={() =>
                                        tabViewRef.current?.disableTouchable()
                                    }
                                    onTouchEnd={() =>
                                        tabViewRef.current?.enableTouchable()
                                    }
                                    detailGroupBuyingName={
                                        ROOT_SCREEN.detailGroupBuying
                                    }
                                />
                            )}
                            {listPostsPaging.list.map(item =>
                                RenderItemPost(item),
                            )}
                            {listPostsPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>

                        <View style={styles.tabView}>
                            {isShopAccount &&
                                listPostsReviewAbout.list.map(item =>
                                    RenderItemPost(item),
                                )}
                            {isShopAccount && listPostsReviewAbout.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>
                    </StyleTabView>
                </ScrollView>

                {isLoading && <LoadingScreen />}
            </View>

            <ListShareElement
                ref={listUserPostsRef}
                title={profile?.name || ''}
                listPaging={listPostsPaging}
                containerStyle={{
                    backgroundColor: theme.backgroundColorSecond,
                }}
                onShowModalComment={params => {
                    modalRef.current?.show(params);
                }}
                isSaveTop
            />

            <ListShareElement
                ref={listPostReviewRef}
                title={profile?.name || ''}
                listPaging={listPostsReviewAbout}
                containerStyle={{
                    backgroundColor: theme.backgroundColorSecond,
                }}
                onShowModalComment={params => {
                    modalRef.current?.show(params);
                }}
                isSaveTop
            />

            <ModalCommentLike
                ref={modalRef}
                theme={theme}
                bubbleFocusing={bubbleFocusing || fakeBubbleFocusing}
                updateBubbleFocusing={value =>
                    setBubbleFocusing((preValue: any) => ({
                        ...preValue,
                        ...value,
                    }))
                }
                setTotalComments={value => {
                    setBubbleFocusing(preValue => {
                        if (preValue) {
                            return {
                                ...preValue,
                                totalComments: value,
                            };
                        }
                        return preValue;
                    });
                }}
                increaseTotalComments={value => {
                    setBubbleFocusing(preValue => {
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

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: isFollowing
                            ? 'profile.screen.unFollow'
                            : 'profile.screen.follow',
                        action: onHandleFollow,
                    },
                    {
                        text: 'profile.modalize.block',
                        action: () => onBlockUser(id),
                    },
                    {
                        text: 'profile.modalize.report',
                        action: () => onReport(id, profile?.name || ' '),
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />

            <StyleActionSheet
                ref={actionReviewRef}
                listTextAndAction={[
                    {
                        text: 'profile.reviewProvider',
                        action: () => {
                            if (profile) {
                                navigate(PROFILE_ROUTE.createPostPickImg, {
                                    userReviewed: {
                                        id: profile.id,
                                        name: profile.name,
                                        avatar: profile.avatar,
                                    },
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
        </>
    );
};

const styles = ScaledSheet.create({
    body: {
        flexGrow: 1,
        alignContent: 'center',
    },
    overlayView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.75,
    },
    contentContainer: {
        paddingBottom: Metrics.safeBottomPadding,
    },
    postStatusView: {
        marginHorizontal: '0.25@ms',
    },
    buttonActivityBox: {
        width: '100%',
        flexDirection: 'row',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActivity: {
        width: '35@s',
        height: '35@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10@s',
        marginTop: '30@vs',
    },
    iconButtonActivity: {
        fontSize: '30@ms',
    },
    // Button edit profile
    btnInteractView: {
        width: '100%',
        paddingHorizontal: '20@s',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: '10@vs',
        borderBottomWidth: Platform.select({
            ios: '0.5@ms',
            android: '0.5@ms',
        }),
        marginTop: -1,
    },
    buttonInteract: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3@vs',
        paddingVertical: '6@vs',
        marginHorizontal: '3@s',
    },
    textInteract: {
        fontSize: FONT_SIZE.small,
    },
    // indicator
    indicatorView: {
        width: '100%',
        flexDirection: 'row',
    },
    indicator: {
        flex: 1 / 3,
        borderTopWidth: Platform.select({
            ios: '1@ms',
            android: '2@ms',
        }),
    },
    // content
    tabView: {
        width,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default OtherProfile;
