/* eslint-disable no-shadow */
/* eslint-disable react/jsx-key */
import {TypeBubblePalace} from 'api/interface';
import {
    apiGetDetailBubble,
    apiGetDetailBubbleEnjoy,
    apiGetListBubbleActive,
    apiGetListBubbleActiveOfUserEnjoy,
} from 'api/module';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {activityShare} from 'asset/staticData';
import Theme from 'asset/theme/Theme';
import {StyleImage} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleText from 'components/base/StyleText';
import StyleTouchable from 'components/base/StyleTouchable';
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
import {Modalize} from 'react-native-modalize';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {interactBubble, onGoToSignUp} from 'utility/assistant';
import Bubble, {bubbleHeight} from './components/Bubble';

export interface TypeShowMoreOptions {
    idUser: number;
    imageWantToSee: string;
    allowSaveImage: boolean;
}

let idUserReport = 0;
let imageSeeDetail = '';
let allowSaveImage = false;

const ListBubbleCouple = () => {
    const optionsRef = useRef<any>(null);
    const modalizeRef = useRef<Modalize>(null);

    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();
    const myId = Redux.getPassport().profile.id;

    const hadLogan = token && !isModeExp;

    const selectedApi = useMemo(() => {
        return token
            ? apiGetListBubbleActive
            : apiGetListBubbleActiveOfUserEnjoy;
    }, [token]);

    const displayComment = Redux.getDisplayComment();
    const bubbleFocusing = Redux.getBubbleFocusing();
    const [preNumberComment, setPreNumberComment] = useState(0);
    const [itemBubble, setItemBubble] = useState({creatorId: undefined});

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

    const onGoToSignUpFromAlert = () => {
        goBack();
        onGoToSignUp();
    };

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

    const onGoToProfile = (item: TypeBubblePalace) => {
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
    /**
     * Render view
     */

    const onShowModalShare = (item: any) => {
        modalizeRef.current?.open();
        setItemBubble(item);
    };

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
                snapToOffsets={list.map((_, index) => index * bubbleHeight)}
                // scrollEventThrottle={16}
                decelerationRate="fast"
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                ListEmptyComponent={LoadingScreen}
                // removeClippedSubviews={true}
                // onEndReached={undefined}
                // onScroll={e => {
                //     const indexToLast = Math.round(
                //         (e.nativeEvent.contentSize.height -
                //             e.nativeEvent.contentOffset.y) /
                //             bubbleHeight,
                //     );
                //     Redux.setBubbleFocusing(list[indexToLast].id);
                // }}]
            />
        );
    };

    const RenderModalShare = () => {
        return (
            <View style={styles.wrapViewModalShare}>
                <View style={styles.wrapViewHeaderModal}>
                    <StyleText
                        i18Text={'discovery.share.title'}
                        customStyle={styles.wrapTextTitleModal}
                    />

                    <StyleTouchable
                        onPress={() => {
                            modalizeRef.current?.close();
                        }}
                        customStyle={styles.wrapTouchCloseModal}>
                        <StyleImage
                            source={Images.icons.close}
                            customStyle={styles.wrapIconClose}
                        />
                    </StyleTouchable>
                </View>
                <View style={styles.wrapViewBodyModal}>
                    <StyleTouchable onPress={() => null}>
                        <StyleImage
                            source={Images.icons.copyLink}
                            customStyle={styles.wrapIconActivityShare}
                        />
                    </StyleTouchable>
                </View>
                <View style={styles.wrapViewBodyModal}>
                    {activityShare.map((item: any) => {
                        return (
                            <StyleTouchable
                                style={styles.wrapViewShare}
                                onPress={() => null}>
                                <StyleImage
                                    source={item.url}
                                    customStyle={{
                                        width: item.width,
                                        height: item.height,
                                    }}
                                />
                                <StyleText
                                    i18Text={item.title}
                                    customStyle={styles.wrapTextTitleShare}
                                />
                            </StyleTouchable>
                        );
                    })}
                </View>
                <View style={styles.wrapViewBodyModalLink}>
                    <StyleTouchable
                        style={styles.wrapViewShare}
                        onPress={() =>
                            navigate(ROOT_SCREEN.reportUser, {
                                idUser: itemBubble.creatorId,
                            })
                        }>
                        <StyleImage
                            source={Images.icons.reportLink}
                            customStyle={styles.wrapIconActivityShare}
                        />
                    </StyleTouchable>
                </View>
            </View>
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
            <Modalize
                ref={modalizeRef}
                modalHeight={verticalScale(340)}
                withHandle={false}
                rootStyle={[styles.wrapModal]}>
                {RenderModalShare()}
            </Modalize>
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
    wrapViewModalShare: {
        height: '100%',
    },
    wrapViewHeaderModal: {
        flexDirection: 'row',
        padding: '16@vs',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Theme.common.textMe,
    },
    wrapViewIconShare: {
        width: '41@vs',
        height: '41@vs',
        backgroundColor: Theme.common.blueInput,
        borderRadius: 5,
        marginRight: '8@s',
    },
    wrapTextTitleModal: {
        fontWeight: '700',
        fontSize: '18@ms0.3',
        color: Theme.common.black,
    },
    wrapTextContentModal: {
        fontWeight: '400',
        fontSize: '13@ms0.3',
        color: Theme.common.gray,
    },
    wrapTouchCloseModal: {
        position: 'absolute',
        top: '10@vs',
        right: '10@s',
    },
    wrapIconClose: {
        width: '28@vs',
        height: '28@vs',
    },
    wrapViewBodyModal: {
        flexDirection: 'row',
        paddingVertical: '19@vs',
        paddingHorizontal: '18@s',
        borderBottomWidth: 1,
        borderBottomColor: Theme.common.textMe,
    },
    wrapViewBodyModalLink: {
        flexDirection: 'row',
        padding: '16@vs',
        alignItems: 'center',
    },
    wrapIconActivityShare: {
        width: '50@vs',
        height: '50@vs',
        marginRight: '29@s',
    },
    wrapViewShare: {
        marginRight: '39@s',
        alignItems: 'center',
    },
    wrapTextTitleShare: {
        fontSize: '14@ms0.3',
        fontWeight: '500',
        color: Theme.common.black,
        marginTop: '5@vs',
    },
});

export default ListBubbleCouple;
