/* eslint-disable no-shadow */
import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiGetListBubbleActive} from 'api/module';
import {apiLikePost, apiUnLikePost} from 'api/post';
import {POST_TYPE, TOPIC, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleIcon} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToSignUp} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import Bubble from './components/Bubble';
import BubbleGroupBuying, {ParamsLikeGB} from './components/BubbleGroupBuying';
import HeaderDoffy, {headerDoffyHeight} from './components/HeaderDoffy';
import HeaderFilterTopic from './HeaderFilterTopic';

export interface TypeMoreOptionsMe {
    postModal: TypeBubblePalace | TypeGroupBuying;
}

let modalOptions: TypeBubblePalace | TypeGroupBuying;

let oldOffset = 0;

const onGoToSignUpFromAlert = () => {
    goBack();
    onGoToSignUp();
};

const DiscoveryScreen = () => {
    useNotification();

    const listRef = useRef<FlatList>(null);
    const optionsRef = useRef<any>(null);
    const headerFilterRef = useRef<HeaderFilterTopic>(null);
    const headerDoffyRef = useRef<HeaderDoffy>(null);

    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();
    const bubblePalace = Redux.getBubblePalaceAction();

    const hadLogan = token && !isModeExp;

    const [listTopics, setListTopics] = useState<Array<number>>([
        TOPIC.travel,
        TOPIC.cuisine,
    ]);
    const [postTypes, setPostTypes] = useState<Array<number>>([
        POST_TYPE.review,
        POST_TYPE.groupBuying,
    ]);
    const [postIdFocusing, setPostIdFocusing] = useState('');

    const {
        list,
        setList,
        loading,
        setParams,
        onLoadMore,
        refreshing,
        onRefresh,
        noMore,
    } = usePaging({
        request: apiGetListBubbleActive,
        params: {
            take: 30,
            topics: undefined,
            postTypes: undefined,
        },
    });

    useEffect(() => {
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });
        const paramsTopic =
            listTopics.length === 2 ? undefined : `[${String(listTopics)}]`;
        const paramsPostTypes =
            postTypes.length === 2 ? undefined : `[${String(postTypes)}]`;
        setParams({
            take: 30,
            topics: paramsTopic,
            postTypes: paramsPostTypes,
        });
    }, [listTopics, postTypes]);

    useEffect(() => {
        if (
            bubblePalace.action ===
            TYPE_BUBBLE_PALACE_ACTION.scrollToTopDiscovery
        ) {
            listRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            });
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        }
    }, [bubblePalace.action]);

    /**
     * Functions
     */
    const onShowModalComment = useCallback(
        (
            post: TypeBubblePalace | TypeGroupBuying,
            type: TypeShowModalCommentOrLike,
        ) => {
            if (!hadLogan) {
                appAlert('discovery.bubble.goToSignUp', {
                    moreNotice: 'common.letGo',
                    moreAction: onGoToSignUpFromAlert,
                });
            } else {
                showCommentDiscovery({
                    post,
                    setList,
                    type,
                });
            }
        },
        [hadLogan],
    );

    const onShowOptions = useCallback((params: TypeMoreOptionsMe) => {
        modalOptions = params.postModal;
        optionsRef.current?.show();
    }, []);

    /**
     * Render views
     */
    const onHandleLikeGB = useCallback(
        async (params: ParamsLikeGB) => {
            const {isLiked, setIsLiked, totalLikes, setTotalLikes, postId} =
                params;

            if (hadLogan) {
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
                                totalLikes:
                                    value.totalLikes + (currentLike ? -1 : 1),
                            };
                        });
                    });
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
        },
        [hadLogan],
    );

    const RenderItemBubble = useCallback(
        (item: TypeBubblePalace & TypeGroupBuying) => {
            if (item.postType === POST_TYPE.review) {
                return (
                    <Bubble
                        item={item}
                        onShowMoreOption={onShowOptions}
                        onShowModalComment={(post, type) =>
                            onShowModalComment(post, type)
                        }
                        isFocusing={postIdFocusing === item.id}
                        onChangePostIdFocusing={postId =>
                            setPostIdFocusing(postId)
                        }
                    />
                );
            }
            if (item.postType === POST_TYPE.groupBuying) {
                return (
                    <BubbleGroupBuying
                        item={item}
                        onGoToDetailGroupBuying={value =>
                            navigate(DISCOVERY_ROUTE.detailGroupBuying, {
                                item: value,
                                setList,
                            })
                        }
                        onShowMoreOption={onShowOptions}
                        onHandleLike={onHandleLikeGB}
                        onShowModalComment={(post, type) =>
                            onShowModalComment(post, type)
                        }
                        onChangePostIdFocusing={postId =>
                            setPostIdFocusing(postId)
                        }
                    />
                );
            }
            return null;
        },
        [postIdFocusing],
    );

    const EmptyView = () => {
        if (loading) {
            return <LoadingScreen />;
        }
        return null;
    };

    const FooterComponent = () => {
        if (noMore) {
            return (
                <StyleIcon
                    source={Images.images.successful}
                    size={80}
                    customStyle={{alignSelf: 'center'}}
                />
            );
        }
        return null;
    };

    const OverLayTop = useMemo(() => {
        return (
            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    }, [theme.backgroundColor]);

    return (
        <>
            <ViewSafeTopPadding />

            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColorSecond},
                ]}>
                <StyleList
                    ref={listRef}
                    data={list}
                    renderItem={({item}) => RenderItemBubble(item)}
                    keyExtractor={(_, index) => String(index)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onLoadMore={onLoadMore}
                    ListHeaderComponent={
                        <View style={{height: headerDoffyHeight}} />
                    }
                    ListEmptyComponent={EmptyView}
                    ListFooterComponent={FooterComponent}
                    ListFooterComponentStyle={{
                        backgroundColor: theme.backgroundColor,
                        paddingVertical: 20,
                    }}
                    maxToRenderPerBatch={20}
                    onScroll={e => {
                        const currentOffset = e.nativeEvent.contentOffset.y;
                        if (currentOffset <= 0) {
                            headerDoffyRef.current?.show();
                            oldOffset = currentOffset;
                            return;
                        }
                        const distance = currentOffset - oldOffset;
                        if (distance > 75) {
                            headerDoffyRef.current?.hide();
                            oldOffset = currentOffset;
                        } else if (distance < -75) {
                            headerDoffyRef.current?.show();
                            oldOffset = currentOffset;
                        }
                    }}
                    // removeClippedSubviews
                />

                <HeaderDoffy
                    ref={headerDoffyRef}
                    theme={theme}
                    onPressFilter={() => headerFilterRef.current?.show()}
                />
                <HeaderFilterTopic
                    ref={headerFilterRef}
                    listTopics={listTopics}
                    listPostTypes={postTypes}
                    theme={theme}
                    onChangeTopic={list => setListTopics(list)}
                    onChangePostType={list => setPostTypes(list)}
                />

                <StyleActionSheet
                    ref={optionsRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.report.title',
                            action: () => {
                                if (hadLogan && modalOptions) {
                                    navigate(ROOT_SCREEN.reportUser, {
                                        idUser: modalOptions.creator,
                                        nameUser: modalOptions.creatorName,
                                    });
                                }
                            },
                        },
                        // {
                        //     text: 'discovery.seeDetailImage',
                        //     action: () => {
                        //         seeDetailImage({
                        //             images: modalOptions.imageWantToSee.map(
                        //                 url => url,
                        //             ),
                        //         });
                        //     },
                        // },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            </View>

            {OverLayTop}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    overlayView: {
        position: 'absolute',
        width: '100%',
        height: Metrics.safeTopPadding,
        top: 0,
    },
});
export default DiscoveryScreen;
