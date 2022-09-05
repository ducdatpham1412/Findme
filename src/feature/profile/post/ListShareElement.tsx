/* eslint-disable no-underscore-dangle */
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeBubblePalace} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiDeletePost} from 'api/module';
import FindmeStore from 'app-redux/store';
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
import {TypeModalCommentPost} from 'components/ModalCommentLike';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Bubble from 'feature/discovery/components/Bubble';
import {
    TypeMoreOptionsMe,
    TypeShowMoreOptions,
} from 'feature/discovery/DiscoveryScreen';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {Component} from 'react';
import {Animated, FlatList, StyleProp, ViewStyle} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet} from 'react-native-size-matters';
import {DefaultTransitionSpec} from 'utility/animation';
import {logger, seeDetailImage} from 'utility/assistant';

interface Props {
    title: string;
    listPaging: any;
    containerStyle?: StyleProp<ViewStyle>;
    onShowModalComment(params: TypeModalCommentPost): void;
    isSaveTop?: boolean;
}

interface States {
    postIdFocusing: string;
}

interface TypeShow {
    index: number;
    postId: string;
}

let postModal: TypeBubblePalace;

const onGoToEditPost = () => {
    if (postModal) {
        navigate(PROFILE_ROUTE.createPostPreview, {
            itemEdit: postModal,
        });
    }
};

export default class ListShareElement extends Component<Props, States> {
    pan = new Animated.ValueXY();

    scale = new Animated.Value(0);

    listRef = React.createRef<FlatList>();

    myOptionRef = React.createRef<any>();

    friendOptionRef = React.createRef<any>();

    state: States = {
        postIdFocusing: '',
    };

    // When press "Go to detail post in ProfileScreen",
    // Disable catch scroll fail to avoid scroll to other index => Low performance
    private enableCatchScrollFail = true;

    // When show ListShareElement
    // Disable hearing scrollEvent in ProfileScreen to avoid scrollToEnd
    private enableHearingScrollEvent = true;

    isShowing() {
        const temp: any = this.scale;
        return temp._value === 1;
    }

    show(params: TypeShow) {
        this.enableCatchScrollFail = false;
        this.enableHearingScrollEvent = false;
        this.listRef.current?.scrollToIndex({
            index: params.index,
            animated: false,
        });
        Animated.timing(this.scale, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            this.setState({
                postIdFocusing: params.postId,
            });
        });
    }

    hide() {
        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
            timing(this.scale, {
                ...transitionConfig,
                toValue: 0,
                useNativeDriver: false,
            }),
        ]).start(() => {
            this.enableHearingScrollEvent = true;
            this.setState({
                postIdFocusing: '',
            });
        });
    }

    scrollToNearingEnd() {
        if (this.enableHearingScrollEvent) {
            if (this.enableCatchScrollFail === false) {
                this.enableCatchScrollFail = true;
            }
            const indexLast = this.props.listPaging.list.length - 2;
            if (indexLast >= 1) {
                this.listRef.current?.scrollToIndex({
                    index: indexLast,
                    animated: false,
                });
            }
        }
    }

    private onDeletePost(postId: string) {
        const agreeDelete = async () => {
            try {
                await apiDeletePost(postId);
                this.props.listPaging.setList(
                    (preValue: Array<TypeBubblePalace>) => {
                        return preValue.filter(item => item.id !== postId);
                    },
                );
            } catch (err) {
                appAlert(err);
            }
        };

        appAlertYesNo({
            i18Title: 'profile.post.sureDeletePost',
            agreeChange: agreeDelete,
            refuseChange: goBack,
        });
    }

    private showOptions(params: TypeShowMoreOptions & TypeMoreOptionsMe) {
        postModal = params.postModal;
        const {id} = FindmeStore.getState().accountSlice.passport.profile;
        if (postModal.creator === id) {
            this.myOptionRef.current?.show();
        } else {
            this.friendOptionRef.current?.show();
        }
    }

    private showModalComment(
        post: TypeBubblePalace,
        type: TypeShowModalCommentOrLike,
    ) {
        this.props.onShowModalComment({
            post,
            setList: this.props.listPaging.setList,
            type,
        });
    }

    private async showModalShare(post: TypeBubblePalace) {
        try {
            const link = await dynamicLinks().buildShortLink({
                link: `${post?.images?.[0] || LANDING_PAGE_URL}?type=${
                    TYPE_DYNAMIC_LINK.post
                }&post_id=${post.id}`,
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
    }

    RenderItemBubble = (item: TypeBubblePalace) => {
        return (
            <Bubble
                item={item}
                onShowMoreOption={value => this.showOptions(value)}
                onShowModalComment={(post, type) =>
                    this.showModalComment(post, type)
                }
                onShowModalShare={post => this.showModalShare(post)}
                isFocusing={this.state.postIdFocusing === item.id}
                onChangePostIdFocusing={postId =>
                    this.setState({postIdFocusing: postId})
                }
            />
        );
    };

    render() {
        const {listPaging, containerStyle, title, isSaveTop} = this.props;

        const MyModalOption = () => {
            return (
                <StyleActionSheet
                    ref={this.myOptionRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.seeDetailImage',
                            action: () => {
                                if (postModal?.images.length) {
                                    seeDetailImage({
                                        images: postModal.images.map(
                                            url => url,
                                        ),
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
                                    this.onDeletePost(postModal.id);
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

        const FriendModalOptions = () => {
            return (
                <StyleActionSheet
                    ref={this.friendOptionRef}
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
                                    seeDetailImage({
                                        images: postModal.images.map(
                                            url => url,
                                        ),
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
            <>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [
                                {translateX: this.pan.x},
                                {translateY: this.pan.y},
                                {scaleX: this.scale},
                            ],
                        },
                        containerStyle,
                    ]}>
                    {!!isSaveTop && <ViewSafeTopPadding />}
                    <StyleHeader onGoBack={() => this.hide()} title={title} />
                    <StyleList
                        ref={this.listRef}
                        data={listPaging.list}
                        maxToRenderPerBatch={50}
                        initialNumToRender={50}
                        renderItem={({item}) => this.RenderItemBubble(item)}
                        keyExtractor={(_, index) => String(index)}
                        onEndReached={listPaging.onLoadMore}
                        refreshing={listPaging.loading}
                        onRefresh={listPaging.onRefresh}
                        onScrollToIndexFailed={e => {
                            if (this.enableCatchScrollFail) {
                                logger(e.highestMeasuredFrameIndex);
                                if (e.highestMeasuredFrameIndex - 1 >= 1) {
                                    this.listRef.current?.scrollToIndex({
                                        index: e.highestMeasuredFrameIndex - 1,
                                        animated: false,
                                    });
                                }
                            }
                        }}
                    />
                </Animated.View>

                {MyModalOption()}
                {FriendModalOptions()}
            </>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
