import {TypeCreatePostResponse} from 'api/interface';
import {
    apiDeletePost,
    apiGetDetailBubble,
    apiLikePost,
    apiUnLikePost,
} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import ModalComment from 'feature/discovery/components/ModalComment';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
    showSwipeImages,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {bubbleProfileHeight, onGoToSignUp} from 'utility/assistant';
import BubbleProfile from './BubbleProfile';

interface Props {
    route: {
        params: {
            listInProfile: Array<TypeCreatePostResponse>;
            initIndex: number;
            setListInProfile: Function;
            allowSaveImage?: boolean;
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

let postModalize: TypeCreatePostResponse | undefined;

const ListDetailPost = ({route}: Props) => {
    const {listInProfile, initIndex, setListInProfile} = route.params;
    const allowSaveImage = route.params?.allowSaveImage;

    const isModeExp = Redux.getModeExp();
    const myId = Redux.getPassport().profile.id;
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const isMyListPost = listInProfile[0].creator === myId;

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

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editPostFromProfile
        ) {
            setList((preValue: Array<TypeCreatePostResponse>) => {
                return preValue.map(item => {
                    if (item.id !== bubblePalaceAction.payload.id) {
                        return item;
                    }
                    return {
                        ...item,
                        ...bubblePalaceAction.payload,
                    };
                });
            });
        }
    }, [bubblePalaceAction]);

    const onShowOptions = (item: TypeCreatePostResponse) => {
        postModalize = item;
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

    const onHandleLike = async (params: TypeLikeUnlikeParams) => {
        const {bubbleId, isLiked, setIsLiked, totalLikes, setTotalLikes} =
            params;
        if (!isModeExp) {
            const currentLike = isLiked;
            const currentNumberLikes = totalLikes;
            try {
                setIsLiked(!currentLike);
                setTotalLikes(currentNumberLikes + (currentLike ? -1 : 1));
                if (currentLike) {
                    await apiUnLikePost(bubbleId);
                } else {
                    await apiLikePost(bubbleId);
                }
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

    const onDeletePost = (postId: string) => {
        const agreeDelete = async () => {
            try {
                await apiDeletePost(postId);
                setList(preValue => {
                    return preValue.filter(item => item.id !== postId);
                });
                setListInProfile((preValue: Array<TypeCreatePostResponse>) => {
                    return preValue.filter(item => item.id !== postId);
                });
            } catch (err) {
                appAlert(err);
            }
        };

        appAlertYesNo({
            i18Title: 'profile.post.sureDeletePost',
            agreeChange: agreeDelete,
            refuseChange: goBack,
        });
    };

    const onShowModalComment = (bubble: TypeCreatePostResponse) => {
        setBubbleFocusing(bubble);
        setDisplayComment(true);
    };

    const onSeeDetailImage = (imageUrl: string) => {
        showSwipeImages({
            listImages: [{url: imageUrl}],
            allowSaveImage,
        });
    };

    const onGoToEditPost = () => {
        if (postModalize) {
            navigate(PROFILE_ROUTE.createPostPreview, {
                itemEdit: postModalize,
            });
        }
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
                onLikeOrUnLike={onHandleLike}
                onSeeDetailImage={onSeeDetailImage}
            />
        );
    }, []);

    const ModalizePost = () => {
        if (isMyListPost) {
            return (
                <StyleActionSheet
                    ref={optionsRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.seeDetailImage',
                            action: () => {
                                showSwipeImages({
                                    listImages: [
                                        {url: postModalize?.images[0] || ''},
                                    ],
                                    allowSaveImage,
                                });
                            },
                        },
                        {
                            text: 'profile.post.editPost',
                            action: onGoToEditPost,
                        },
                        {
                            text: 'profile.post.delete',
                            action: () => {
                                if (postModalize?.id) {
                                    onDeletePost(postModalize.id);
                                }
                            },
                        },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            );
        }

        return (
            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: 'discovery.report.title',
                        action: () => {
                            navigate(ROOT_SCREEN.reportUser, {
                                idUser: postModalize,
                            });
                        },
                    },
                    {
                        text: 'discovery.seeDetailImage',
                        action: () => {
                            showSwipeImages({
                                listImages: [
                                    {url: postModalize?.images[0] || ''},
                                ],
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
        );
    };

    return (
        <View style={styles.container}>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                // snapToInterval={height}
                scrollEventThrottle={16}
                decelerationRate="fast"
                initialScrollIndex={initIndex}
                getItemLayout={(_, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
                // snapToOffsets={list.map((_, index) => index * height)}
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

            {ModalizePost()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    backIcon: {
        position: 'absolute',
        top: '100@vs',
        backgroundColor: `rgba(8, 16, 25, ${0.4})`,
        borderRadius: '20@vs',
    },
});

export default ListDetailPost;
