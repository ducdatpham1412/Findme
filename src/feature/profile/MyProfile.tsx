import {TypeCreatePostResponse} from 'api/interface';
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
import StyleTabView from 'components/StyleTabView';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {tabBarViewHeight} from 'navigation/components/TabNavigator';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    NativeScrollEvent,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
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
let listMyPosts: Array<TypeCreatePostResponse> = [];

const safeLoadMoreStyle: any = {
    overflow: 'hidden',
    height:
        Metrics.height -
        tabBarViewHeight -
        toolProfileHeight -
        searchSettingHeight, // check to remove this
};

const ProfileAccount = ({routeName}: ChildrenProps) => {
    const {profile} = Redux.getPassport();
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const theme = Redux.getTheme();

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

    const optionRef = useRef<any>(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewPost
        ) {
            myPostsPaging.setList((preValue: Array<TypeCreatePostResponse>) =>
                [bubblePalaceAction.payload].concat(preValue),
            );
        }
    }, [bubblePalaceAction]);

    useEffect(() => {
        listMyPosts = myPostsPaging.list;
    }, [myPostsPaging.list]);

    /**
     * Functions
     */
    const onShowOption = () => {
        optionRef.current.show();
    };

    const onGoToDetailPost = (bubbleId: string) => {
        const temp = listMyPosts.findIndex(item => item.id === bubbleId);
        const initIndex = temp < 0 ? 0 : temp;
        navigate(ROOT_SCREEN.listDetailPost, {
            listInProfile: listMyPosts,
            initIndex,
            setListInProfile: myPostsPaging.setList,
            allowSaveImage: true,
        });
    };

    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(profile.id);
            Redux.updatePassport({
                profile: res.data,
            });
            if (tabIndex === 0) {
                myPostsPaging.onRefresh();
            } else if (tabIndex === 1) {
                postsLikedPaging.onRefresh();
            } else if (tabIndex === 2) {
                postsSavedPaging.onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const checkScrollEnd = (nativeEvent: NativeScrollEvent) => {
        if (isScrollCloseToBottom(nativeEvent)) {
            if (tabIndex === 0) {
                myPostsPaging.onLoadMore();
            } else if (tabIndex === 1) {
                postsLikedPaging.onLoadMore();
            } else if (tabIndex === 2) {
                postsSavedPaging.onLoadMore();
            }
        }
    };

    /**
     * Render views
     */
    const RenderItemPost = useCallback((item: TypeCreatePostResponse) => {
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
        <>
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
                stickyHeaderIndices={[1]}
                onMomentumScrollEnd={({nativeEvent}) =>
                    checkScrollEnd(nativeEvent)
                }
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
                <ToolProfile
                    index={tabIndex}
                    onChangeTab={index => setTabIndex(index)}
                />

                <StyleTabView
                    index={tabIndex}
                    onChangeIndex={value => setTabIndex(value)}
                    listCallbackWhenFocus={[
                        () => null,
                        () => postsLikedPaging.onLoadMore(),
                        () => postsSavedPaging.onLoadMore(),
                    ]}>
                    <View
                        style={[
                            styles.contentContainerPost,
                            tabIndex === 0 ? {} : safeLoadMoreStyle,
                        ]}>
                        {myPostsPaging.list.map(RenderItemPost)}
                    </View>
                    <View
                        style={[
                            styles.contentContainerPost,
                            tabIndex === 1 ? {} : safeLoadMoreStyle,
                        ]}>
                        {postsLikedPaging.list.map(RenderItemPost)}
                    </View>
                    <View
                        style={[
                            styles.contentContainerPost,
                            tabIndex === 2 ? {} : safeLoadMoreStyle,
                        ]}>
                        {postsSavedPaging.list.map(RenderItemPost)}
                    </View>
                </StyleTabView>
            </ScrollView>

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
            />
        </>
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
});

export default MyProfile;
