/* eslint-disable no-underscore-dangle */
import {TypeBubblePalace} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiDeletePost} from 'api/module';
import {apiArchivePost} from 'api/post';
import FindmeStore from 'app-redux/store';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import {TypeModalCommentPost} from 'components/ModalCommentLike';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Bubble from 'feature/discovery/components/Bubble';
import {
    TypeMoreOptionsMe,
    TypeShowMoreOptions,
} from 'feature/discovery/DiscoveryScreen';
import Redux from 'hook/useRedux';
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

const onArchivePost = async (post: TypeBubblePalace) => {
    try {
        await apiArchivePost(post.id);
        Redux.setBubblePalaceAction({
            action: TYPE_BUBBLE_PALACE_ACTION.archivePost,
            payload: {
                ...post,
                isArchived: true,
            },
        });
    } catch (err) {
        appAlert(err);
    }
};

export default class ListShareElement extends Component<Props, States> {
    pan = new Animated.ValueXY();

    scale = new Animated.Value(0);

    listRef = React.createRef<FlatList>();

    myOptionRef = React.createRef<any>();

    draftOptionRef = React.createRef<any>();

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
        const {id} = FindmeStore.getState().accountSlice.passport.profile;
        postModal = params.postModal;
        if (postModal.creator === id) {
            if (postModal.isDraft || postModal.isArchived) {
                this.draftOptionRef.current?.show();
            } else {
                this.myOptionRef.current?.show();
            }
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

    RenderItemBubble = (item: TypeBubblePalace) => {
        return (
            <Bubble
                item={item}
                onShowMoreOption={value => this.showOptions(value)}
                onShowModalComment={(post, type) =>
                    this.showModalComment(post, type)
                }
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
                            text: 'profile.post.edit',
                            action: onGoToEditPost,
                        },
                        {
                            text: 'profile.post.archive',
                            action: () => onArchivePost(postModal),
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

        const DraftOption = () => {
            return (
                <StyleActionSheet
                    ref={this.draftOptionRef}
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
                            text: 'profile.post.edit',
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
                {DraftOption()}
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
