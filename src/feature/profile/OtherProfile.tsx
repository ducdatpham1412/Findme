import {TypeCreatePostResponse, TypeGetProfileResponse} from 'api/interface';
import {
    apiBlockUser,
    apiFollowUser,
    apiGetListPost,
    apiGetProfile,
    apiUnFollowUser,
} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import NoData from 'components/common/NoData';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
    interactBubble,
    modalizeMyProfile,
    modalizeYourProfile,
} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import ListShareElement from './post/ListShareElement';
import ModalCommentListDetailPost, {
    showModalCommentListDetailPost,
} from './post/ModalCommentListDetailPost';
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

let listPosts: Array<TypeCreatePostResponse> = [];

const OtherProfile = ({route}: Props) => {
    const {id, onGoBack} = route.params;
    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const myId = Redux.getPassport().profile.id;

    const optionsRef = useRef<any>(null);
    const shareRef = useRef<ListShareElement>(null);

    const [profile, setProfile] = useState<TypeGetProfileResponse>();
    const [isFollowing, setIsFollowing] = useState(false);
    const [bubbleFocusing, setBubbleFocusing] =
        useState<TypeCreatePostResponse>();

    const isMyProfile = id === myId;
    const isBlock = profile?.relationship === RELATIONSHIP.block;
    const listPaging = usePaging({
        request: apiGetListPost,
        params: {
            userId: id,
        },
    });
    const {list, refreshing, onRefresh, onLoadMore} = listPaging;

    const getData = async () => {
        try {
            if (id && !isModeExp) {
                Redux.setIsLoading(true);
                const res = await apiGetProfile(id);
                setIsFollowing(
                    res.data.relationship === RELATIONSHIP.following,
                );
                setProfile(res.data);
            }
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    useEffect(() => {
        listPosts = list;
    }, [list]);

    useEffect(() => {
        getData();
    }, [shouldRenderOtherProfile]);

    const onSendMessage = () => {
        if (profile?.name && profile.id && profile.avatar) {
            interactBubble({
                userId: profile.id,
                name: profile.name,
                avatar: profile.avatar,
            });
        }
    };

    const onBlockUser = async () => {
        try {
            await apiBlockUser(id);
        } catch (err) {
            appAlert(err);
        }
    };
    const onReport = async () => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser: id,
        });
    };

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
            if (!isModeExp) {
                onRefresh();
                const res = await apiGetProfile(id);
                setIsFollowing(
                    res.data.relationship === RELATIONSHIP.following,
                );
                setProfile(res.data);
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onGoToDetailPost = (bubbleId: string) => {
        const initIndex = listPosts.findIndex(item => item.id === bubbleId);
        shareRef.current?.show({
            index: initIndex === -1 ? 0 : initIndex,
        });
    };

    /**
     * Render_view
     */
    const HeaderComponent = () => {
        return (
            <>
                {!!profile && (
                    <InformationProfile
                        profile={profile}
                        routeName={route.name}
                    />
                )}

                <View
                    style={[
                        styles.btnInteractView,
                        {backgroundColor: theme.backgroundColor},
                    ]}>
                    {!isMyProfile && (
                        <>
                            <StyleTouchable
                                customStyle={[
                                    styles.buttonInteract,
                                    {
                                        backgroundColor:
                                            theme.backgroundButtonColor,
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
                                            fontWeight: isFollowing
                                                ? 'normal'
                                                : 'bold',
                                        },
                                    ]}
                                />
                            </StyleTouchable>

                            <StyleTouchable
                                customStyle={[
                                    styles.buttonInteract,
                                    {
                                        backgroundColor:
                                            theme.backgroundButtonColor,
                                    },
                                ]}
                                onPress={onSendMessage}>
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
                        </>
                    )}
                </View>
            </>
        );
    };

    const RenderItemPost = useCallback((item: TypeCreatePostResponse) => {
        return (
            <PostStatus
                key={item.id}
                itemPost={item}
                onGoToDetailPost={onGoToDetailPost}
                containerStyle={styles.postStatusView}
            />
        );
    }, []);

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
                <SearchAndSetting
                    onShowOptions={onShowOption}
                    hasSettingBtn={false}
                    onGoBack={onGoBack}
                />
                <NoData content="No Data" />
            </>
        );
    }

    return (
        <>
            <AvatarBackground avatar={profile?.avatar || ''} />
            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />

            <SearchAndSetting
                onShowOptions={onShowOption}
                hasSettingBtn={false}
                onGoBack={onGoBack}
            />

            <StyleList
                data={list}
                renderItem={({item}) => RenderItemPost(item)}
                ListHeaderComponent={HeaderComponent()}
                ListEmptyComponent={() => null}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshing={refreshing}
                onRefresh={onRefreshPage}
                onLoadMore={onLoadMore}
                numColumns={3}
                onScrollBeginDrag={() => {
                    shareRef.current?.scrollToNearingEnd();
                }}
            />

            <ListShareElement
                ref={shareRef}
                title={profile?.name || ''}
                listPaging={listPaging}
                containerStyle={{
                    backgroundColor: theme.backgroundColorSecond,
                }}
                onShowModalComment={params => {
                    setBubbleFocusing(params.post);
                    showModalCommentListDetailPost(params);
                }}
            />

            <ModalCommentListDetailPost
                bubbleFocusing={bubbleFocusing}
                setBubbleFocusing={(value: TypeCreatePostResponse) => {
                    if (bubbleFocusing) {
                        setBubbleFocusing(preValue => ({
                            ...preValue,
                            ...value,
                        }));
                    }
                }}
                changeTotalCommentsFocusing={value => {
                    if (bubbleFocusing) {
                        setBubbleFocusing(preValue => {
                            if (preValue) {
                                return {
                                    ...preValue,
                                    totalComments:
                                        preValue.totalComments + value,
                                };
                            }
                            return preValue;
                        });
                    }
                }}
            />

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={
                    isMyProfile
                        ? modalizeMyProfile
                        : modalizeYourProfile({
                              onBlockUser,
                              onReport,
                              onHandleFollow,
                              isFollowing,
                          })
                }
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
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
        paddingBottom: '25@vs',
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
        fontSize: '11@ms',
    },
    containerBlock: {
        flex: 1,
    },
});

export default OtherProfile;
