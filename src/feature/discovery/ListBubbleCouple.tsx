/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeBubblePalace, TypeCreatePostResponse} from 'api/interface';
import {
    apiGetListBubbleActive,
    apiGetListBubbleActiveOfUserEnjoy,
} from 'api/module';
import {TYPE_DYNAMIC_LINK} from 'asset/enum';
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
import {showModalCommentDiscovery} from 'feature/discovery/components/ModalCommentDiscovery';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    goBack,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToSignUp} from 'utility/assistant';
import Bubble from './components/Bubble';
import HeaderDoffy, {headerDoffyHeight} from './components/HeaderDoffy';

export interface TypeShowMoreOptions {
    idUser: number;
    imageWantToSee: Array<string>;
    allowSaveImage: boolean;
}

export interface TypeMoreOptionsMe {
    postModal: TypeCreatePostResponse;
}

let idUserReport = 0;
let imageSeeDetail: Array<string> = [];
let allowSaveImage = false;

let oldOffset = 0;

const onGoToSignUpFromAlert = () => {
    goBack();
    onGoToSignUp();
};

const ListBubbleCouple = () => {
    const optionsRef = useRef<any>(null);

    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();

    const hadLogan = token && !isModeExp;

    const selectedApi = useMemo(() => {
        return token
            ? apiGetListBubbleActive
            : apiGetListBubbleActiveOfUserEnjoy;
    }, [token]);

    const [isShowHeader, setIsShowHeader] = useState(true);

    const {list, setList, onLoadMore, refreshing, onRefresh} = usePaging({
        request: selectedApi,
        params: {
            take: 30,
        },
    });

    /**
     * Functions
     */
    const onShowModalComment = (post: TypeBubblePalace) => {
        if (!hadLogan) {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: onGoToSignUpFromAlert,
            });
        } else {
            showModalCommentDiscovery({
                post,
                setList,
            });
        }
    };

    const onShowOptions = (params: TypeShowMoreOptions) => {
        idUserReport = params.idUser;
        imageSeeDetail = params.imageWantToSee;
        allowSaveImage = params.allowSaveImage;
        optionsRef.current?.show();
    };

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
                onShowModalComment={() => onShowModalComment(item)}
                onShowModalShare={() => onShowModalShare(item)}
            />
        );
    }, []);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColorSecond},
            ]}>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                ListEmptyComponent={LoadingScreen}
                ListHeaderComponent={
                    <View style={{height: headerDoffyHeight}} />
                }
                maxToRenderPerBatch={20}
                onScroll={e => {
                    const currentOffset = e.nativeEvent.contentOffset.y;
                    if (currentOffset === 0) {
                        setIsShowHeader(true);
                        oldOffset = currentOffset;
                        return;
                    }
                    const distance = currentOffset - oldOffset;
                    if (distance > 75) {
                        setIsShowHeader(false);
                        oldOffset = currentOffset;
                    } else if (distance < -75) {
                        setIsShowHeader(true);
                        oldOffset = currentOffset;
                    }
                }}
                // removeClippedSubviews={true}
            />

            <HeaderDoffy isShowHeader={isShowHeader} />

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
export default ListBubbleCouple;
