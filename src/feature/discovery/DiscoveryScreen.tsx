/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeBubblePalace} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {
    apiGetListBubbleActive,
    apiGetListBubbleActiveOfUserEnjoy,
} from 'api/module';
import {TOPIC, TYPE_BUBBLE_PALACE_ACTION, TYPE_DYNAMIC_LINK} from 'asset/enum';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    LANDING_PAGE_URL,
} from 'asset/standardValue';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    goBack,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToSignUp} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import Bubble from './components/Bubble';
import HeaderDoffy, {headerDoffyHeight} from './components/HeaderDoffy';
import HeaderFilterTopic from './HeaderFilterTopic';

export interface TypeShowMoreOptions {
    idUser: number;
    imageWantToSee: Array<string>;
    allowSaveImage: boolean;
}

export interface TypeMoreOptionsMe {
    postModal: TypeBubblePalace;
}

let idUserReport = 0;
let imageSeeDetail: Array<string> = [];
let allowSaveImage = false;

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

    const selectedApi = useMemo(() => {
        return token
            ? apiGetListBubbleActive
            : apiGetListBubbleActiveOfUserEnjoy;
    }, [token]);

    const [listTopics, setListTopics] = useState<Array<number>>([
        TOPIC.travel,
        TOPIC.cuisine,
        TOPIC.shopping,
    ]);

    const {
        list,
        setList,
        loading,
        setParams,
        onLoadMore,
        refreshing,
        onRefresh,
    } = usePaging({
        request: selectedApi,
        params: {
            take: 30,
            listTopics: undefined,
        },
    });

    useEffect(() => {
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });
        const paramsTopic =
            listTopics.length === 3 ? undefined : `[${String(listTopics)}]`;
        setParams({
            take: 30,
            listTopics: paramsTopic,
        });
    }, [listTopics]);

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
        (post: TypeBubblePalace, type: TypeShowModalCommentOrLike) => {
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

    const onShowOptions = useCallback((params: TypeShowMoreOptions) => {
        idUserReport = params.idUser;
        imageSeeDetail = params.imageWantToSee;
        allowSaveImage = params.allowSaveImage;
        optionsRef.current?.show();
    }, []);

    const onShowModalShare = async (item: TypeBubblePalace) => {
        try {
            const link = await dynamicLinks().buildShortLink({
                link: `${item?.images?.[0] || LANDING_PAGE_URL}?type=${
                    TYPE_DYNAMIC_LINK.post
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
                message: 'Doffy share',
                url: link,
            });
        } catch (err) {
            appAlert(err);
        }
    };

    /**
     * Render views
     */
    const RenderItemBubble = useCallback((item: TypeBubblePalace) => {
        return (
            <Bubble
                item={item}
                onShowMoreOption={onShowOptions}
                onShowModalComment={(post, type) =>
                    onShowModalComment(post, type)
                }
                onShowModalShare={post => onShowModalShare(post)}
            />
        );
    }, []);

    const EmptyView = () => {
        if (loading) {
            return <LoadingScreen />;
        }
        return null;
    };

    return (
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
                theme={theme}
                onChangeTopic={list => setListTopics(list)}
            />

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: 'discovery.report.title',
                        action: () => {
                            navigate(ROOT_SCREEN.reportUser, {
                                idUser: idUserReport,
                            });
                        },
                    },
                    {
                        text: 'discovery.seeDetailImage',
                        action: () => {
                            showSwipeImages({
                                listImages: imageSeeDetail.map(item => ({
                                    url: item,
                                })),
                                allowSaveImage,
                            });
                        },
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});
export default DiscoveryScreen;
