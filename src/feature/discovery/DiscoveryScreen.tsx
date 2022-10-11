/* eslint-disable no-shadow */
import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {
    TypeResultSearch,
    TypeShowModalCommentOrLike,
} from 'api/interface/discovery';
import {apiGetListBubbleActive} from 'api/module';
import {apiLikePost, apiUnLikePost} from 'api/post';
import {POST_TYPE, TOPIC, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleIcon} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ImageBackground, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToSignUp} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import Bubble from './components/Bubble';
import BubbleGroupBuying, {ParamsLikeGB} from './components/BubbleGroupBuying';
import HeaderDoffy from './components/HeaderDoffy';
import ListTopGroupBuying, {spaceHeight} from './components/ListTopGroupBuying';
import SearchBar from './components/SearchBar';
import HeaderFilterTopic from './HeaderFilterTopic';

export interface TypeMoreOptionsMe {
    postModal: TypeBubblePalace | TypeGroupBuying;
}

let modalOptions: TypeBubblePalace | TypeGroupBuying;
let footerHeight = 0;

const onGoToSignUpFromAlert = () => {
    goBack();
    onGoToSignUp();
};

const DiscoveryScreen = () => {
    useNotification();

    const listRef = useRef<FlatList>(null);
    const optionsRef = useRef<any>(null);
    const headerFilterRef = useRef<HeaderFilterTopic>(null);
    const headerRef = useRef<HeaderDoffy>(null);
    const topGroupBuyingRef = useRef<ListTopGroupBuying>(null);
    const searchBarRef = useRef<SearchBar>(null);

    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();
    const bubblePalace = Redux.getBubblePalaceAction();
    const {profile} = Redux.getPassport();
    const {imageBackground} = Redux.getResource();

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
    const [showTopGroupBooking, setShowTopGroupBooking] = useState(true);
    const [resultSearch, setResultSearch] = useState<TypeResultSearch>(null);

    const {
        list,
        setList,
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
            search: '',
        },
        onSuccess: data => {
            setResultSearch(data.result);
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
        setParams(preValue => ({
            ...preValue,
            topics: paramsTopic,
            postTypes: paramsPostTypes,
        }));
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
                        detailGroupTarget={DISCOVERY_ROUTE.detailGroupBuying}
                    />
                );
            }
            return null;
        },
        [postIdFocusing],
    );

    const FooterComponent = () => {
        if (noMore) {
            return (
                <StyleIcon
                    source={Images.images.successful}
                    size={50}
                    customStyle={{
                        alignSelf: 'center',
                    }}
                />
            );
        }
        return null;
    };

    return (
        <ImageBackground
            source={{uri: imageBackground}}
            imageStyle={{
                top: -470,
            }}
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColorSecond},
            ]}>
            <HeaderDoffy
                ref={headerRef}
                theme={theme}
                profile={profile}
                onPressFilterIcon={() => headerFilterRef.current?.show()}
            />

            <View
                style={{flex: 1, overflow: 'hidden'}}
                onLayout={e => {
                    footerHeight = e.nativeEvent.layout.height - spaceHeight;
                }}>
                <StyleList
                    ref={listRef}
                    data={list}
                    renderItem={({item}) => RenderItemBubble(item)}
                    keyExtractor={(_, index) => String(index)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onLoadMore={onLoadMore}
                    ListHeaderComponent={
                        <ListTopGroupBuying
                            ref={topGroupBuyingRef}
                            showTopGroupBooking={showTopGroupBooking}
                        />
                    }
                    ListFooterComponent={FooterComponent}
                    ListFooterComponentStyle={{
                        backgroundColor: theme.backgroundColor,
                        paddingVertical: 20,
                        marginTop: -1,
                        height: list.length > 0 ? undefined : footerHeight,
                    }}
                    ListEmptyComponent={null}
                    maxToRenderPerBatch={20}
                    onScroll={({nativeEvent}) => {
                        const {y} = nativeEvent.contentOffset;
                        if (y >= 0 && y < spaceHeight / 3) {
                            searchBarRef.current?.setTranslateY(0);
                            searchBarRef.current?.setOpacity(
                                1 - y / spaceHeight,
                            );
                            headerRef.current?.setOpacity(0);
                            topGroupBuyingRef.current?.setOpacity(1);
                        } else if (y >= spaceHeight / 3 && y <= spaceHeight) {
                            searchBarRef.current?.setTranslateY(-y);
                            searchBarRef.current?.setOpacity(0);
                            const ratio =
                                (y - spaceHeight / 3) / ((spaceHeight * 2) / 3);
                            headerRef.current?.setOpacity(ratio);
                            topGroupBuyingRef.current?.setOpacity(1 - ratio);
                        } else if (y > spaceHeight && y < spaceHeight * 2) {
                            headerRef.current?.setOpacity(1);
                            topGroupBuyingRef.current?.setOpacity(0);
                            searchBarRef.current?.setTranslateY(-y);
                        }
                    }}
                    keyboardDismissMode="on-drag"
                    stickyHeaderIndices={[0]}
                    invertStickyHeaders
                />

                <SearchBar
                    ref={searchBarRef}
                    theme={theme}
                    onSearch={text => {
                        setParams(preValue => ({...preValue, search: text}));
                    }}
                    onChangeShowTopGroupBooking={value =>
                        setShowTopGroupBooking(value)
                    }
                    resultSearch={resultSearch}
                    topics={listTopics}
                    postTypes={postTypes}
                />
            </View>

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
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />

            <HeaderFilterTopic
                ref={headerFilterRef}
                listTopics={listTopics}
                listPostTypes={postTypes}
                theme={theme}
                onChangeTopic={list => setListTopics(list)}
                onChangePostType={list => setPostTypes(list)}
            />
        </ImageBackground>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});
export default DiscoveryScreen;
