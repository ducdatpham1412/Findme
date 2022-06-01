import {TypeCreatePostResponse} from 'api/interface';
import {apiGetDetailBubble, apiLikePost, apiUnLikePost} from 'api/module';
import Theme from 'asset/theme/Theme';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import ModalComment from 'feature/discovery/components/ModalComment';
import {TypeShowMoreOptions} from 'feature/discovery/ListBubbleCouple';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    goBack,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
    bubbleProfileHeight,
    bubbleProfileWidth,
    onGoToSignUp,
} from 'utility/assistant';
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

let idUserReport = 0;
let imageWantToSee = '';

const ListDetailPost = ({route}: Props) => {
    const {listInProfile, initIndex, setListInProfile} = route.params;

    const isModeExp = Redux.getModeExp();

    const optionsRef = useRef<any>(null);

    const [bubbleFocusing, setBubbleFocusing] = useState(
        listInProfile[initIndex],
    );
    const [displayComment, setDisplayComment] = useState(false);
    const [list, setList] = useState(listInProfile);

    const height = bubbleProfileHeight();

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

    const onShowOptions = (params: TypeShowMoreOptions) => {
        imageWantToSee = params.imageWantToSee;
        idUserReport = params.idUser;
        optionsRef.current?.show();
    };

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

    const onSeeDetailImage = (imageUrl: string) => {
        showSwipeImages({
            listImages: [{url: imageUrl}],
        });
    };

    /**
     * Render view
     */
    const RenderItemBubble = useCallback((item: TypeCreatePostResponse) => {
        return (
            <BubbleProfile
                item={item}
                onShowOptions={onShowOptions}
                onRefreshItem={onRefreshItem}
                onShowModalComment={onShowModalComment}
                onLikeOrUnLike={onLikeOrUnLike}
                onSeeDetailImage={onSeeDetailImage}
            />
        );
    }, []);

    return (
        <View style={styles.container}>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                snapToInterval={height}
                scrollEventThrottle={16}
                decelerationRate="fast"
                initialScrollIndex={initIndex}
                getItemLayout={(_, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
                snapToOffsets={list.map((_, index) => index * height)}
            />

            <HeaderLeftIcon
                style={styles.backIcon}
                onPress={goBack}
                iconStyle={{color: Theme.darkTheme.textColor}}
            />

            <ModalComment
                bubbleFocusing={bubbleFocusing}
                setBubbleFocusing={setBubbleFocusing}
                displayComment={displayComment}
                setDisplayComment={setDisplayComment}
                isNotModalOfMainTab
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
                                listImages: [{url: imageWantToSee}],
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
        width: bubbleProfileWidth(),
        height: bubbleProfileHeight(),
    },
    backIcon: {
        position: 'absolute',
        top: '100@vs',
        backgroundColor: `rgba(8, 16, 25, ${0.4})`,
        borderRadius: '20@vs',
    },
});

export default ListDetailPost;
