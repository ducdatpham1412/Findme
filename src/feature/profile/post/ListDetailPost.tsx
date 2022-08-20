import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeCreatePostResponse} from 'api/interface';
import {apiDeletePost} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION, TYPE_DYNAMIC_LINK} from 'asset/enum';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    LANDING_PAGE_URL,
} from 'asset/standardValue';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Bubble from 'feature/discovery/components/Bubble';
import {TypeShowMoreOptions} from 'feature/discovery/ListBubbleCouple';
import Redux from 'hook/useRedux';
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
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import ModalCommentListDetailPost, {
    showModalCommentListDetailPost,
} from './ModalCommentListDetailPost';

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

export interface TypeMoreOptionsMe {
    postModal: TypeCreatePostResponse;
}

let postModal: TypeCreatePostResponse;

const onGoToEditPost = () => {
    if (postModal) {
        navigate(PROFILE_ROUTE.createPostPreview, {
            itemEdit: postModal,
        });
    }
};

const ListDetailPost = ({route}: Props) => {
    const {listInProfile, setListInProfile} = route.params;
    const myId = Redux.getPassport().profile.id;
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const isMyListPost = listInProfile[0].creator === myId;

    const optionsRef = useRef<any>(null);

    const [list, setList] = useState(listInProfile);
    const [bubbleFocusing, setBubbleFocusing] =
        useState<TypeCreatePostResponse>();

    useEffect(() => {
        setListInProfile(list);
    }, [list]);

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

    const onShowModalShare = async (item: TypeCreatePostResponse) => {
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

    const showModalComment = (post: TypeCreatePostResponse) => {
        setBubbleFocusing(post);
        showModalCommentListDetailPost({
            post,
            setList,
        });
    };

    const onShowOptions = (params: TypeShowMoreOptions & TypeMoreOptionsMe) => {
        postModal = params.postModal;
        optionsRef.current?.show();
    };

    /**
     * Render view
     */
    const RenderItemBubble = useCallback((item: TypeCreatePostResponse) => {
        return (
            <Bubble
                item={item}
                onShowMoreOption={onShowOptions}
                onShowModalComment={showModalComment}
                onShowModalShare={onShowModalShare}
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
                                if (postModal?.images.length) {
                                    showSwipeImages({
                                        listImages: postModal.images.map(
                                            item => ({
                                                url: item,
                                            }),
                                        ),
                                        allowSaveImage: false,
                                    });
                                }
                            },
                        },
                        {
                            text: 'profile.post.editPost',
                            action: onGoToEditPost,
                        },
                        {
                            text: 'profile.post.delete',
                            action: () => {
                                if (postModal?.id) {
                                    onDeletePost(postModal.id);
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
                                idUser: postModal.creator,
                            });
                        },
                    },
                    {
                        text: 'discovery.seeDetailImage',
                        action: () => {
                            if (postModal?.images.length) {
                                showSwipeImages({
                                    listImages: postModal.images.map(item => ({
                                        url: item,
                                    })),
                                    allowSaveImage: false,
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
        );
    };

    return (
        <View style={styles.container}>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={(_, index) => String(index)}
                // snapToInterval={height}
                scrollEventThrottle={30}
                decelerationRate="fast"
                // initialScrollIndex={initIndex}
                // getItemLayout={(_, index) => ({
                //     length: height,
                //     offset: height * index,
                //     index,
                // })}
                // snapToOffsets={list.map((_, index) => index * height)}
            />

            {ModalizePost()}

            <ModalCommentListDetailPost
                bubbleFocusing={bubbleFocusing}
                setBubbleFocusing={setBubbleFocusing}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});

export default ListDetailPost;
