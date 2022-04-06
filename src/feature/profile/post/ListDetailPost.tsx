import {TypeCreatePostResponse} from 'api/interface';
import {apiGetDetailBubble, apiLikePost, apiUnLikePost} from 'api/module';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import ModalComment from 'feature/discovery/components/ModalComment';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useState} from 'react';
import {Animated} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToSignUp} from 'utility/assistant';
import BubbleProfile from './BubbleProfile';

interface Props {
    route: {
        params: {
            listInProfile: Array<TypeCreatePostResponse>;
            initIndex: number;
            setListInProfile: Function;
        };
    };
}

export interface TypeLikeUnlikeParams {
    bubbleId: string;
    isLiked: boolean;
    setIsLiked: Function;
    totalLikes: number;
    setTotalLikes: Function;
}

const bubbleHeight = Metrics.height - Metrics.safeBottomPadding;

const ListDetailPost = ({route}: Props) => {
    const {listInProfile, initIndex, setListInProfile} = route.params;

    const isModeExp = Redux.getModeExp();

    const [bubbleFocusing, setBubbleFocusing] = useState(
        listInProfile[initIndex],
    );
    const [displayComment, setDisplayComment] = useState(false);

    const [list, setList] = useState(listInProfile);

    useEffect(() => {
        setListInProfile(list);
    }, [list]);

    useEffect(() => {
        setList((preValue: Array<TypeCreatePostResponse>) => {
            return preValue.map(item => {
                if (item.id !== bubbleFocusing.id) {
                    return item;
                }
                return bubbleFocusing;
            });
        });
    }, [bubbleFocusing]);

    const onReportUser = useCallback((idUser: number) => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser,
        });
    }, []);

    const onRefreshItem = async (idBubble: string) => {
        if (isModeExp) {
            return;
        }
        try {
            const res: any = await apiGetDetailBubble(idBubble);
            setList((preValue: Array<TypeCreatePostResponse>) => {
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

    const onLikeOrUnLike = async (params: TypeLikeUnlikeParams) => {
        const {bubbleId, isLiked, setIsLiked, totalLikes, setTotalLikes} =
            params;
        if (!isModeExp) {
            const currentLike = isLiked;
            const currentNumberLikes = totalLikes;
            try {
                setIsLiked(!currentLike);
                setTotalLikes(currentNumberLikes + (currentLike ? -1 : 1));
                currentLike
                    ? await apiUnLikePost(bubbleId)
                    : await apiLikePost(bubbleId);
                setList((preValue: Array<TypeCreatePostResponse>) => {
                    return preValue.map(item => {
                        if (item.id !== bubbleId) {
                            return item;
                        }
                        return {
                            ...item,
                            isLiked: !currentLike,
                            totalLikes:
                                currentNumberLikes + (currentLike ? -1 : 1),
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
                moreAction: onGoToSignUp,
            });
        }
    };

    const onShowModalComment = (bubble: TypeCreatePostResponse) => {
        setBubbleFocusing(bubble);
        setDisplayComment(true);
    };

    /**
     * Render view
     */

    const RenderItemBubble = useCallback((item: TypeCreatePostResponse) => {
        return (
            <BubbleProfile
                item={item}
                onReportUser={onReportUser}
                onRefreshItem={onRefreshItem}
                onShowModalComment={onShowModalComment}
                onLikeOrUnLike={onLikeOrUnLike}
            />
        );
    }, []);

    return (
        <Animated.View style={styles.container}>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                snapToInterval={bubbleHeight}
                // scrollEventThrottle={16}
                decelerationRate="fast"
                initialScrollIndex={initIndex}
                getItemLayout={(_, index) => ({
                    length: bubbleHeight,
                    offset: bubbleHeight * index,
                    index,
                })}
            />

            <HeaderLeftIcon style={styles.backIcon} onPress={goBack} />

            <ModalComment
                bubbleFocusing={bubbleFocusing}
                setBubbleFocusing={setBubbleFocusing}
                displayComment={displayComment}
                setDisplayComment={setDisplayComment}
                isNotModalOfMainTab
            />
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width:
            Metrics.width - Metrics.safeLeftPadding - Metrics.safeRightPadding,
        height: Metrics.height - Metrics.safeBottomPadding,
    },
    backIcon: {
        position: 'absolute',
        top: Metrics.safeTopPadding,
    },
});

export default ListDetailPost;
