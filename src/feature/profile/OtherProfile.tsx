import {
    TypeGetProfileResponse,
    TypeSendMessageFromProfile,
} from 'api/interface';
import {
    apiBlockUser,
    apiFollowUser,
    apiGetListPost,
    apiGetProfile,
    apiUnFollowUser,
} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import NoData from 'components/common/NoData';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
    interactBubble,
    modalizeMyProfile,
    modalizeYourProfile,
} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
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

const OtherProfile = ({route}: Props) => {
    const {id, onGoBack} = route.params;
    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const myId = Redux.getPassport().profile.id;

    const optionsRef = useRef<any>(null);

    const [search, setSearch] = useState('');
    const [profile, setProfile] = useState<TypeGetProfileResponse>();
    const [isFollowing, setIsFollowing] = useState(false);

    const isMyProfile = id === myId;
    const isBlock = profile?.relationship === RELATIONSHIP.block;

    const {list, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListPost,
        params: {
            userId: id,
        },
    });

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
        getData();
    }, [shouldRenderOtherProfile]);

    // on send message
    const onSendMessage = () => {
        if (profile?.name && profile.id && profile.avatar) {
            const itemBubble: TypeSendMessageFromProfile = {
                name: profile?.name,
                creatorId: profile?.id,
                creatorAvatar: profile?.avatar,
            };
            interactBubble({
                itemBubble,
                isBubble: false,
                isEffectTabBar: false,
            });
        }
    };

    // on search
    const onSubmitSearch = () => {
        console.log('search');
    };

    // block, report
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

    // follow
    const onUnFollow = async () => {
        try {
            setIsFollowing(false);
            await apiUnFollowUser(id);
        } catch (err) {
            setIsFollowing(true);
            appAlert(err);
        }
    };
    const onFollow = async () => {
        try {
            if (id) {
                setIsFollowing(true);
                await apiFollowUser(id);
            }
        } catch (err) {
            setIsFollowing(false);
            appAlert(err);
        }
    };

    // modalize
    const onShowOption = () => {
        if (isBlock) {
            return;
        }
        optionsRef.current.show();
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

    const onGoToDetailPost = (postId: string) => {
        navigate(ROOT_SCREEN.detailBubble, {
            bubbleId: postId,
            displayComment: true,
        });
    };

    /**
     * Render_view
     */
    const HeaderComponent = useMemo(() => {
        const havingButtonFollow = !isFollowing && !isMyProfile;
        const havingButtonMessage = !isMyProfile;

        return (
            <>
                {/* Information: avatar - cover - name - follow */}
                {!!profile && (
                    <InformationProfile
                        profile={profile}
                        routeName={route.name}
                    />
                )}

                <View style={styles.btnInteractView}>
                    {/* Button follow */}
                    {havingButtonFollow && (
                        <StyleTouchable
                            customStyle={[
                                styles.buttonEditProfile,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}
                            onPress={onFollow}>
                            <StyleText
                                i18Text="profile.screen.follow"
                                customStyle={[
                                    styles.textEditProfile,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}

                    {/* Button send message */}
                    {havingButtonMessage && (
                        <StyleTouchable
                            customStyle={[
                                styles.buttonEditProfile,
                                {
                                    flex: havingButtonFollow ? 0.25 : 0.75,
                                    backgroundColor:
                                        theme.backgroundButtonColor,
                                },
                            ]}
                            onPress={onSendMessage}>
                            <AntDesign
                                name="message1"
                                style={[
                                    styles.textEditProfile,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}
                </View>
            </>
        );
    }, [profile, isFollowing, isMyProfile, list]);

    const RenderItem = useCallback(
        ({item}: any) => {
            return (
                <PostStatus
                    itemPost={item}
                    onGoToDetailPost={onGoToDetailPost}
                />
            );
        },
        [list],
    );

    return (
        <>
            {!!profile?.avatar && <AvatarBackground avatar={profile.avatar} />}

            {isBlock && <NoData content="No Data" />}

            {/* Information profile, List photos */}
            {!isBlock && (
                <StyleList
                    data={list}
                    keyExtractor={item => item.id}
                    renderItem={RenderItem}
                    ListHeaderComponent={HeaderComponent}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    refreshing={refreshing}
                    onRefresh={onRefreshPage}
                    onLoadMore={onLoadMore}
                />
            )}

            {/* Header */}
            <SearchAndSetting
                search={search}
                onSearch={setSearch}
                onShowOptions={onShowOption}
                onSubmitSearch={onSubmitSearch}
                hasSettingBtn={false}
                onGoBack={onGoBack}
            />

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={
                    isMyProfile
                        ? modalizeMyProfile
                        : modalizeYourProfile({
                              onBlockUser,
                              onReport,
                              onUnFollow,
                              onFollow,
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
    contentContainer: {
        paddingBottom: '100@vs',
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
        paddingVertical: '10@vs',
        justifyContent: 'center',
    },
    buttonEditProfile: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5@vs',
        paddingVertical: '10@vs',
        marginHorizontal: '3@s',
    },
    textEditProfile: {
        fontSize: '15@ms',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    // BLOCK VIEW
    containerBlock: {
        flex: 1,
    },
});

export default OtherProfile;
