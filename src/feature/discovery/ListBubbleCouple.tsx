/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
import {TypeBubblePalace} from 'api/interface';
import {
    apiGetDetailBubble,
    apiGetDetailBubbleEnjoy,
    apiGetListBubbleActive,
    apiGetListBubbleActiveOfUserEnjoy,
} from 'api/module';
import FindmeStore from 'app-redux/store';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    goBack,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import {interactBubble, onGoToSignUp} from 'utility/assistant';
import Bubble from './components/Bubble';

export interface TypeShowMoreOptions {
    idUser: number;
    imageWantToSee: string;
    allowSaveImage: boolean;
}

let idUserReport = 0;
let imageSeeDetail = '';
let allowSaveImage = false;

const onGoToSignUpFromAlert = () => {
    goBack();
    onGoToSignUp();
};

const onGoToProfile = (item: TypeBubblePalace) => {
    const myId = FindmeStore.getState().accountSlice.passport.profile.id;
    if (item.hadKnowEachOther) {
        if (item.creatorId === myId) {
            navigate(PROFILE_ROUTE.myProfile);
        } else {
            navigate(ROOT_SCREEN.otherProfile, {
                id: item.creatorId,
            });
        }
    }
};

const onSeeDetailImage = (url: string, allowSave: boolean) => {
    showSwipeImages({
        listImages: [{url}],
        allowSaveImage: allowSave,
    });
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

    const displayComment = Redux.getDisplayComment();
    const bubbleFocusing = Redux.getBubbleFocusing();
    const [preNumberComment, setPreNumberComment] = useState(0);

    const {list, setList, onLoadMore, refreshing, onRefresh} = usePaging({
        request: selectedApi,
        params: {
            take: 30,
        },
        numberMaxForList: 30,
    });

    useEffect(() => {
        if (
            bubbleFocusing &&
            bubbleFocusing.totalComments !== preNumberComment &&
            !displayComment
        ) {
            setList((preValue: Array<TypeBubblePalace>) => {
                return preValue.map(item => {
                    if (item.id !== bubbleFocusing.id) {
                        return item;
                    }
                    return {
                        ...item,
                        totalComments: bubbleFocusing?.totalComments,
                    };
                });
            });
            setPreNumberComment(bubbleFocusing?.totalComments);
        }
    }, [bubbleFocusing, preNumberComment, displayComment]);

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
            Redux.updateBubbleFocusing(post);
            Redux.setDisplayComment(true);
            setPreNumberComment(post.totalComments);
        }
    };

    const onInteractBubble = (itemBubble: TypeBubblePalace) => {
        if (hadLogan) {
            interactBubble({
                itemBubble,
                isBubble: !itemBubble.hadKnowEachOther,
            });
        } else {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: onGoToSignUpFromAlert,
            });
        }
    };

    const onShowOptions = (params: TypeShowMoreOptions) => {
        idUserReport = params.idUser;
        imageSeeDetail = params.imageWantToSee;
        allowSaveImage = params.allowSaveImage;
        optionsRef.current?.show();
    };

    const onRefreshItem = async (idBubble: string) => {
        try {
            const res = hadLogan
                ? await apiGetDetailBubble(idBubble)
                : await apiGetDetailBubbleEnjoy(idBubble);
            setList((preValue: Array<TypeBubblePalace>) => {
                return preValue.map(item => {
                    if (item.id !== idBubble) {
                        return item;
                    }
                    return res.data;
                });
            });
        } catch (err) {
            appAlert(err);
        }
    };

    const onShowModalShare = (item: TypeBubblePalace) => {
        // let imagePath: any = null;
        // RNFetchBlob.config({
        //     fileCache: true,
        // })
        //     .fetch('GET', item.images[0])
        //     .then(resp => {
        //         imagePath = resp.path();
        //         return resp.readFile('base64');
        //     })
        //     .then(async base64Data => {
        //         const temp = `data:image/png;base64,${base64Data}`;
        //         await Share.open({
        //             message: item.content,
        //             url: temp,
        //         });
        //         return RNFetchBlob.fs.unlink(imagePath);
        //     });
        Share.open({
            message: item.images[0],
        });
    };

    /**
     * Render views
     */
    const RenderItemBubble = useCallback((item: TypeBubblePalace) => {
        return (
            <Bubble
                item={item}
                onInteractBubble={onInteractBubble}
                onShowMoreOption={onShowOptions}
                onRefreshItem={onRefreshItem}
                onGoToProfile={onGoToProfile}
                onShowModalComment={() => onShowModalComment(item)}
                onSeeDetailImage={onSeeDetailImage}
                onShowModalShare={() => onShowModalShare(item)}
            />
        );
    }, []);

    const RenderBubblePlaceStatic = () => {
        return (
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                // snapToInterval={bubbleHeight}
                // snapToOffsets={list.map((_, index) => index * bubbleHeight)}
                // scrollEventThrottle={16}
                decelerationRate="fast"
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                ListEmptyComponent={LoadingScreen}
                // removeClippedSubviews={true}
            />
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {RenderBubblePlaceStatic()}

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
                                listImages: [{url: imageSeeDetail}],
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
        paddingTop: Metrics.tabBarUp,
    },
    wrapModal: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
});

export default ListBubbleCouple;
