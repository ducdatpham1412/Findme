import {useIsFocused} from '@react-navigation/native';
import {TypeBubblePalace} from 'api/interface';
import {
    apiGetListPost,
    apiGetListPostsLiked,
    apiGetListPostsSaved,
    apiGetProfile,
} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleActionSheet from 'components/common/StyleActionSheet';
import ModalCommentLike, {
    TypeModalCommentPost,
} from 'components/ModalCommentLike';
import StyleTabView from 'components/StyleTabView';
import ListShareElement from 'feature/profile/post/ListShareElement';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {tabBarViewHeight} from 'navigation/components/TabNavigator';
import {appAlert} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Animated,
    NativeScrollEvent,
    Platform,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {
    fakeBubbleFocusing,
    isScrollCloseToBottom,
    modalizeMyProfile,
    onGoToSignUp,
} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting, {
    searchSettingHeight,
} from './components/SearchAndSetting';
import ToolProfile, {toolProfileHeight} from './components/ToolProfile';
import PostStatus from './post/PostStatus';

interface ChildrenProps {
    routeName: string;
}

const extraHeight = -(Metrics.safeBottomPadding + verticalScale(7));
const screenWidth = Metrics.width;

/** ------------------------
 * Profile Enjoy
 * -------------------------
 */
const ProfileEnjoy = ({routeName}: ChildrenProps) => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();

    const optionRef = useRef<any>(null);

    const onShowOption = () => {
        optionRef.current.show();
    };

    return (
        <>
            <AvatarBackground avatar={profile.avatar} />
            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />

            <SearchAndSetting
                onShowOptions={onShowOption}
                hasBackBtn={false}
                hasGuideButton
            />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <InformationProfile
                    profile={profile}
                    routeName={routeName}
                    havingEditProfile
                />
                <ToolProfile index={0} onChangeTab={() => null} />
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
let listShareElement: Array<TypeBubblePalace> = [];
let tabIndexRef = 0;
let checkIsFocus = true;

const safeLoadMoreStyle: any = {
    overflow: 'hidden',
    height:
        Metrics.height -
        tabBarViewHeight -
        toolProfileHeight -
        searchSettingHeight, // check to remove this
};

const ProfileAccount = ({routeName}: ChildrenProps) => {
    const isFocused = useIsFocused();

    const {profile} = Redux.getPassport();
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const theme = Redux.getTheme();

    const modalLikeCommentRef = useRef<ModalCommentLike>(null);

    const showModalLikeComment = useCallback((params: TypeModalCommentPost) => {
        modalLikeCommentRef.current?.show(params);
    }, []);

    const myPostsPaging = usePaging({
        request: apiGetListPost,
        params: {
            userId: profile.id,
        },
    });
    const postsLikedPaging = usePaging({
        request: apiGetListPostsLiked,
        isInitNotRunRequest: true,
    });
    const postsSavedPaging = usePaging({
        request: apiGetListPostsSaved,
        isInitNotRunRequest: true,
    });

    const translateXIndicator = useRef(new Animated.Value(0)).current;
    const optionRef = useRef<any>(null);
    const myPostRef = useRef<ListShareElement>(null);
    const postLikedRef = useRef<ListShareElement>(null);
    const postSavedRef = useRef<ListShareElement>(null);
    const tabViewRef = useRef<StyleTabView>(null);
    const scrollRef = useRef<ScrollView>(null);

    const [tabIndex, setTabIndex] = useState(0);
    const [bubbleFocusing, setBubbleFocusing] = useState<TypeBubblePalace>();
    const isFocusMyPost = tabIndex === 0;
    const isFocusPostLiked = tabIndex === 1;
    const isFocusPostSaved = tabIndex === 2;

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewPost
        ) {
            myPostsPaging.setList((preValue: Array<TypeBubblePalace>) =>
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
            myPostsPaging.setList((preValue: Array<TypeBubblePalace>) =>
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
        }
    }, [bubblePalaceAction]);

    useEffect(() => {
        let x: any;
        if (!isFocused) {
            checkIsFocus = false;
        } else {
            x = setTimeout(() => {
                checkIsFocus = true;
            }, 200);
        }
        return () => {
            clearTimeout(x);
        };
    }, [isFocused]);

    useEffect(() => {
        if (
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
        }
    }, [bubblePalaceAction]);

    useEffect(() => {
        if (tabIndex === 0) {
            listShareElement = myPostsPaging.list;
        } else if (tabIndex === 1) {
            listShareElement = postsLikedPaging.list;
        } else if (tabIndex === 2) {
            listShareElement = postsSavedPaging.list;
        }
        tabIndexRef = tabIndex;
    }, [
        tabIndex,
        myPostsPaging.list,
        postsLikedPaging.list,
        postsSavedPaging.list,
    ]);

    /**
     * Functions
     */
    const onShowOption = useCallback(() => {
        optionRef.current.show();
    }, []);

    const onGoToDetailPost = (bubbleId: string) => {
        const initIndex = listShareElement.findIndex(
            item => item.id === bubbleId,
        );
        if (tabIndexRef === 0) {
            myPostRef.current?.show({
                index: initIndex === -1 ? 0 : initIndex,
                postId: bubbleId,
            });
        } else if (tabIndexRef === 1) {
            postLikedRef.current?.show({
                index: initIndex === -1 ? 0 : initIndex,
                postId: bubbleId,
            });
        } else if (tabIndexRef === 2) {
            postSavedRef.current?.show({
                index: initIndex === -1 ? 0 : initIndex,
                postId: bubbleId,
            });
        }
    };

    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(profile.id);
            Redux.updatePassport({
                profile: res.data,
            });
            if (isFocusMyPost) {
                myPostsPaging.onRefresh();
            } else if (isFocusPostLiked) {
                postsLikedPaging.onRefresh();
            } else if (isFocusPostSaved) {
                postsSavedPaging.onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const checkScrollEnd = (nativeEvent: NativeScrollEvent) => {
        if (isScrollCloseToBottom(nativeEvent)) {
            if (isFocusMyPost) {
                myPostsPaging.onLoadMore();
            } else if (isFocusPostLiked) {
                postsLikedPaging.onLoadMore();
            } else if (isFocusPostSaved) {
                postsSavedPaging.onLoadMore();
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
    const RenderItemPost = useCallback((item: TypeBubblePalace) => {
        return (
            <PostStatus
                key={item.id}
                itemPost={item}
                onGoToDetailPost={onGoToDetailPost}
                containerStyle={styles.itemPostView}
            />
        );
    }, []);

    return (
        <View style={{flex: 1}}>
            <AvatarBackground avatar={profile.avatar} />
            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColorSecond},
                ]}
            />
            <SearchAndSetting
                onShowOptions={onShowOption}
                hasBackBtn={false}
                hasGuideButton
            />
            <ScrollView
                ref={scrollRef}
                stickyHeaderIndices={[1]}
                onMomentumScrollEnd={({nativeEvent}) => {
                    checkScrollEnd(nativeEvent);
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={!!myPostsPaging.refreshing}
                        onRefresh={onRefreshPage}
                        tintColor={theme.highlightColor}
                        colors={[theme.highlightColor]}
                    />
                }
                showsVerticalScrollIndicator={false}>
                <InformationProfile
                    profile={profile}
                    routeName={routeName}
                    havingEditProfile
                />
                <>
                    <ToolProfile
                        index={tabIndex}
                        onChangeTab={index => {
                            setTabIndex(index);
                            tabViewRef.current?.navigateToIndex(index);
                        }}
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
                                    flex: 1 / 3,
                                    borderTopColor: theme.borderColor,
                                    transform: [
                                        {translateX: translateXIndicator},
                                    ],
                                },
                            ]}
                        />
                    </View>
                </>

                <StyleTabView
                    ref={tabViewRef}
                    onFirstNavigateToIndex={index => {
                        if (index === 1) {
                            postsLikedPaging.onLoadMore();
                        } else if (index === 2) {
                            postsSavedPaging.onLoadMore();
                        }
                    }}
                    onScroll={e => {
                        translateXIndicator.setValue(e.position * screenWidth);
                        if (e.index !== tabIndex) {
                            setTabIndex(e.index);
                        }
                    }}>
                    <View
                        style={[
                            styles.contentContainerPost,
                            isFocusMyPost ? {} : safeLoadMoreStyle,
                        ]}>
                        {myPostsPaging.list.map(RenderItemPost)}
                    </View>
                    <View
                        style={[
                            styles.contentContainerPost,
                            isFocusPostLiked ? {} : safeLoadMoreStyle,
                        ]}>
                        {postsLikedPaging.list.map(RenderItemPost)}
                    </View>
                    <View
                        style={[
                            styles.contentContainerPost,
                            isFocusPostSaved ? {} : safeLoadMoreStyle,
                        ]}>
                        {postsSavedPaging.list.map(RenderItemPost)}
                    </View>
                </StyleTabView>
            </ScrollView>

            <ListShareElement
                ref={myPostRef}
                title={profile.name}
                listPaging={myPostsPaging}
                containerStyle={{
                    backgroundColor: theme.backgroundColorSecond,
                }}
                onShowModalComment={showModalLikeComment}
            />

            <ListShareElement
                ref={postLikedRef}
                title={profile.name}
                listPaging={postsLikedPaging}
                containerStyle={{
                    backgroundColor: theme.backgroundColorSecond,
                }}
                onShowModalComment={showModalLikeComment}
            />

            <ListShareElement
                ref={postSavedRef}
                title={profile.name}
                listPaging={postsSavedPaging}
                containerStyle={{
                    backgroundColor: theme.backgroundColorSecond,
                }}
                onShowModalComment={showModalLikeComment}
            />

            <ModalCommentLike
                ref={modalLikeCommentRef}
                theme={theme}
                bubbleFocusing={bubbleFocusing || fakeBubbleFocusing}
                updateBubbleFocusing={value => {
                    setBubbleFocusing(preValue => ({
                        ...preValue,
                        ...value,
                    }));
                }}
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
                inputCommentContainerStyle={styles.inputCommentView}
                extraHeight={extraHeight}
            />

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
            />
        </View>
    );
};

/**
 * BOSS HERE
 */
const MyProfile = ({route}: any) => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    if (!isModeExp && token) {
        return <ProfileAccount routeName={route.name} />;
    }
    return <ProfileEnjoy routeName={route.name} />;
};

const styles = ScaledSheet.create({
    contentContainer: {
        paddingBottom: '100@vs',
        flexGrow: 1,
    },
    overlayView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.75,
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
        width: Metrics.width,
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        height: '2@vs',
    },
    indicator: {
        flex: 1 / 3,
        borderTopWidth: Platform.select({
            ios: '1@ms',
            android: '2@ms',
        }),
    },
});

export default MyProfile;
