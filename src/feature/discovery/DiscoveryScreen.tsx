import {TypeBubblePalace} from 'api/interface';
import {
    apiGetDetailBubble,
    apiGetDetailBubbleEnjoy,
    apiGetListBubbleActive,
    apiGetListBubbleActiveOfUserEnjoy,
} from 'api/module';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import LoadingScreen from 'components/LoadingScreen';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {interactBubble, onGoToSignUp} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import Bubble from './components/Bubble';

const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const DiscoveryScreen = () => {
    useNotification();

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const myId = Redux.getPassport().profile.id;

    const selectedApi = useMemo(() => {
        return isModeExp
            ? apiGetListBubbleActiveOfUserEnjoy
            : apiGetListBubbleActive;
    }, [isModeExp]);

    const {list, setList, onLoadMore, refreshing, onRefresh} = usePaging({
        request: selectedApi,
        params: {
            take: 30,
        },
        numberMaxForList: 30,
    });

    const displayComment = Redux.getDisplayComment();
    const bubbleFocusing = Redux.getBubbleFocusing();
    const [preNumberComment, setPreNumberComment] = useState(0);

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

    const onShowModalComment = useCallback(
        (post: TypeBubblePalace) => {
            if (isModeExp) {
                appAlert('discovery.bubble.goToSignUp', {
                    moreNotice: 'common.letGo',
                    moreAction: onGoToSignUp,
                });
            } else {
                Redux.updateBubbleFocusing(post);
                Redux.setDisplayComment(true);
                setPreNumberComment(post.totalComments);
            }
        },
        [isModeExp],
    );

    const onInteractBubble = useCallback(
        (itemBubble: TypeBubblePalace) => {
            if (!isModeExp) {
                interactBubble({
                    itemBubble,
                    isBubble: !itemBubble.hadKnowEachOther,
                });
            } else {
                appAlert('discovery.bubble.goToSignUp', {
                    moreNotice: 'common.letGo',
                    moreAction: onGoToSignUp,
                });
            }
        },
        [isModeExp],
    );

    const onReportUser = useCallback((idUser: number) => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser,
        });
    }, []);

    const onRefreshItem = useCallback(
        async (idBubble: string) => {
            try {
                const res = isModeExp
                    ? await apiGetDetailBubbleEnjoy(idBubble)
                    : await apiGetDetailBubble(idBubble);
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
        },
        [isModeExp],
    );

    const onGoToProfile = useCallback(
        (item: TypeBubblePalace) => {
            if (item.hadKnowEachOther) {
                if (item.creatorId === myId) {
                    navigate(PROFILE_ROUTE.myProfile);
                } else {
                    navigate(ROOT_SCREEN.otherProfile, {
                        id: item.creatorId,
                    });
                }
            }
        },
        [myId],
    );

    /**
     * Render view
     */
    const RenderItemBubble = useCallback((item: TypeBubblePalace) => {
        return (
            <Bubble
                item={item}
                onInteractBubble={onInteractBubble}
                onReportUser={onReportUser}
                onRefreshItem={onRefreshItem}
                onGoToProfile={onGoToProfile}
                onShowModalComment={() => onShowModalComment(item)}
            />
        );
    }, []);

    const RenderBubblePlaceStatic = () => {
        return (
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                snapToInterval={bubbleHeight}
                // scrollEventThrottle={16}
                decelerationRate="fast"
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                ListEmptyComponent={LoadingScreen}
                // onEndReached={undefined}
                // onScroll={e => {
                //     const indexToLast = Math.round(
                //         (e.nativeEvent.contentSize.height -
                //             e.nativeEvent.contentOffset.y) /
                //             bubbleHeight,
                //     );
                //     Redux.setBubbleFocusing(list[indexToLast].id);
                // }}
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
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    // discovery palace
    discoveryPalace: {
        width: '100%',
        height: 2 * Metrics.height,
    },
    discoveryPalaceStatic: {
        flex: 1,
        paddingBottom: '50@s',
    },
});

export default DiscoveryScreen;
