import {useIsFocused} from '@react-navigation/native';
import {TypeChatMessageResponse, TypeChatTagResponse} from 'api/interface';
import {CONVERSATION_STATUS, MESSAGE_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleKeyboardAwareView from 'components/StyleKeyboardAwareView';
import ModalPickImage from 'feature/mess/components/ModalPickImage';
import Redux from 'hook/useRedux';
import {socketUnTyping, useSocketChatDetail} from 'hook/useSocketIO';
import Header from 'navigation/components/Header';
import {MESS_ROUTE} from 'navigation/config/routes';
import {goBack, navigate, showSwipeImages} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Keyboard, TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {chooseColorGradient, isIOS} from 'utility/assistant';
import ItemMessage from './components/ItemMessage';
import Typing from './components/Typing';
import UserInput from './components/UserInput';

interface ChatDetailProps {
    route: {
        params: {
            itemChatTag: TypeChatTagResponse;
            setListChatTags: any;
        };
    };
}

export interface TypeSeeDetailImage {
    listImages: Array<any>;
    index: number;
    inputRef?: any;
}

const initHeightModal = ((Metrics.width - 6) * 2) / 3;

const onGoBack = () => {
    Redux.setChatTagFocusing('');
    goBack();
};

const onSeeDetailImage = (params: TypeSeeDetailImage) => {
    const {listImages, index, inputRef} = params;
    if (inputRef.current?.isFocused() && !isIOS) {
        Keyboard.dismiss();
        const x = setTimeout(() => {
            showSwipeImages({
                listImages,
                initIndex: index,
            });
        }, 100);
        return () => clearTimeout(x);
    }

    showSwipeImages({
        listImages,
        initIndex: index,
    });
    return () => null;
};

const RenderItemMessage = (params: {
    item: TypeChatMessageResponse;
    index: number;
    messages: Array<TypeChatMessageResponse>;
    deleteMessage(idMessage: string): Promise<void>;
    chatColor: Array<string>;
    inputRef: any;
}) => {
    const {item, index, messages, deleteMessage, chatColor, inputRef} = params;
    const isSameMessageAfter =
        messages?.[index + 1]?.relationship === item.relationship;
    const displayPartnerAvatar =
        messages[index - 1]?.relationship !== item.relationship;
    const displaySeenAvatar = true;

    return (
        <ItemMessage
            itemMessage={item}
            isSameMessageAfter={isSameMessageAfter}
            displayPartnerAvatar={displayPartnerAvatar}
            displaySeenAvatar={displaySeenAvatar}
            onDeleteMessage={deleteMessage}
            // listMessagesLength={messages.length}
            chatColor={chatColor}
            onSeeDetailImage={(paramsDetail: any) =>
                onSeeDetailImage({...paramsDetail, inputRef})
            }
        />
    );
};

const ChatDetail = ({route}: ChatDetailProps) => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();
    const listChatTag = Redux.getListChatTag();
    const numberNewMessages = Redux.getNumberNewMessages();
    const {gradient} = Redux.getResource();
    const borderMessRoute = Redux.getBorderMessRoute();

    const listRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const isFocused = useIsFocused();

    const [displayPickImg, setDisplayPickImg] = useState(false);
    const [modalPickImgHeight, setModalPickImgHeight] =
        useState(initHeightModal);

    const [itemChatTag, setItemChatTag] = useState(route.params.itemChatTag);

    const partnerId = useMemo(() => {
        const result = itemChatTag.listUser.find(
            item => item.id !== profile.id,
        );
        return result?.id || profile.id;
    }, [itemChatTag.listUser]);

    const isMyChatTag = useMemo(() => {
        return partnerId === profile.id;
    }, []);

    const {
        messages,
        deleteMessage,
        sendMessage,
        refreshing,
        onRefresh,
        onLoadMore,
    } = useSocketChatDetail({
        isMyChatTag,
        setListChatTags: route.params.setListChatTags,
    });

    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const myAvatar = useMemo(() => {
        for (let i = 0; i < itemChatTag.listUser.length; i++) {
            if (profile.id === itemChatTag.listUser[i].id) {
                return itemChatTag.listUser[i].avatar;
            }
        }
        return '';
    }, []);

    const chatColor = useMemo(() => {
        const color = chooseColorGradient({
            listGradients: gradient,
            colorChoose: itemChatTag.color,
        });
        Redux.setBorderMessRoute(color[2]);
        return color;
    }, [itemChatTag.color]);

    /**
     * Effect
     */
    useEffect(() => {
        for (let i = 0; i < listChatTag.length; i++) {
            const temp = listChatTag[i];
            if (temp.id === itemChatTag.id) {
                setItemChatTag(temp);
            }
        }
    }, [listChatTag]);

    useEffect(() => {
        if (!isFocused) {
            socketUnTyping({
                conversationId: itemChatTag.id,
                userId: profile.id,
            });
        }
    }, [isFocused]);

    /**
     * Send message
     */
    const onSend = async () => {
        // send text
        if (content) {
            setContent('');
            await sendMessage({
                conversationId: itemChatTag.id,
                type: MESSAGE_TYPE.text,
                content: content.trimEnd(),
                creator: profile.id,
                creatorName: profile.name,
                creatorAvatar: myAvatar,
                tag: String(Date.now()),
            });
        }

        // send images
        if (images.length) {
            setImages([]);
            await sendMessage({
                conversationId: itemChatTag.id,
                type: MESSAGE_TYPE.image,
                content: images,
                creator: profile.id,
                creatorName: profile.name,
                creatorAvatar: myAvatar,
                tag: String(Date.now()),
            });
        }

        listRef.current?.scrollToOffset({offset: 0});
    };

    /**
     * Go to setting chat
     */
    const onNavigateToMessSetting = () => {
        navigate(MESS_ROUTE.chatDetailSetting, {
            itemChatTag,
        });
    };

    const onDeleteImage = (index: number) => {
        const temp = [...images];
        temp.splice(index, 1);
        setImages(temp);
    };

    /**
     * Render view
     */
    const RenderHeader = () => {
        let name = itemChatTag.conversationName;
        if (!name) {
            const partnerInfo = itemChatTag.listUser.find(
                userInfo => userInfo.id !== profile.id,
            );
            name = partnerInfo?.name || '';
        }

        const headerLeft = () => {
            return (
                <View style={styles.headerLeftBox}>
                    <AntDesign
                        name="left"
                        style={[styles.iconLeft, {color: borderMessRoute}]}
                    />
                    {!!numberNewMessages && (
                        <View
                            style={[
                                styles.numberNewMessagesBox,
                                {backgroundColor: borderMessRoute},
                            ]}>
                            <StyleText
                                originValue={numberNewMessages}
                                customStyle={[
                                    styles.textNewMessages,
                                    {color: Theme.common.textMe},
                                ]}
                            />
                        </View>
                    )}
                </View>
            );
        };

        const headerOption = () => {
            return (
                <AntDesign
                    name="infocirlceo"
                    style={[styles.iconCloud, {color: borderMessRoute}]}
                />
            );
        };

        return (
            <Header
                headerTitle={name}
                headerTitleMission={onNavigateToMessSetting}
                headerLeft={headerLeft()}
                headerLeftMission={onGoBack}
                headerRight3={headerOption()}
                headerRight3Mission={onNavigateToMessSetting}
                containerStyle={{
                    borderBottomColor: borderMessRoute,
                    height: verticalScale(45),
                }}
                headerTitleStyle={{
                    color: borderMessRoute,
                }}
            />
        );
    };

    const RenderTyping = useMemo(() => {
        if (!itemChatTag?.userTyping || !itemChatTag?.userTyping.length) {
            return null;
        }
        // If is my chat tag, show typing when me typing
        // Else, only show typing when partner is typing
        let userIdDisplay: number | undefined;
        if (isMyChatTag) {
            userIdDisplay = itemChatTag.userTyping.find(
                item => item === profile.id,
            );
            if (!userIdDisplay) {
                return null;
            }
        } else {
            userIdDisplay = itemChatTag.userTyping.find(
                item => item === partnerId,
            );
            if (!userIdDisplay) {
                return null;
            }
        }
        const avatarDisplay =
            itemChatTag.listUser.find(item => item.id === userIdDisplay)
                ?.avatar || '';

        return <Typing avatar={avatarDisplay} isMyChatTag={isMyChatTag} />;
    }, [itemChatTag?.userTyping]);

    const RenderListMessage = () => {
        return (
            <View style={{flex: 1}}>
                <StyleList
                    ref={listRef}
                    data={messages}
                    renderItem={({item, index}: any) =>
                        RenderItemMessage({
                            item,
                            index,
                            inputRef,
                            messages,
                            deleteMessage,
                            chatColor,
                        })
                    }
                    contentContainerStyle={styles.contentContainer}
                    inverted
                    keyExtractor={item => item.id}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onLoadMore={onLoadMore}
                    ListHeaderComponent={RenderTyping}
                />
            </View>
        );
    };

    const RenderImagePreview = () => {
        if (images.length) {
            return (
                <View style={styles.twoImageInput}>
                    {images.map((item, index) => (
                        <View style={styles.imageInputView} key={index}>
                            {/* image */}
                            <StyleImage
                                key={index}
                                source={{uri: item}}
                                customStyle={styles.imageInput}
                            />

                            {/* button delete */}
                            <StyleTouchable
                                customStyle={[
                                    styles.deleteImageBox,
                                    {
                                        backgroundColor: theme.borderColor,
                                    },
                                ]}
                                onPress={() => onDeleteImage(index)}>
                                <Feather
                                    name="x"
                                    style={[
                                        styles.iconDeleteImage,
                                        {color: theme.backgroundColor},
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    ))}
                </View>
            );
        }
        return null;
    };

    const RenderInput = () => {
        const isStopped = itemChatTag.status === CONVERSATION_STATUS.stop;
        if (isStopped || itemChatTag.isBlocked) {
            return (
                <View style={styles.blockView}>
                    <StyleImage
                        source={Images.images.squirrelEnjoy}
                        customStyle={styles.blockImage}
                    />
                </View>
            );
        }

        return (
            <UserInput
                ref={inputRef}
                text={content}
                setText={(text: string) => setContent(text)}
                onSendMessage={onSend}
                images={images}
                setImages={setImages}
                displayPickImg={displayPickImg}
                setDisplayPickImg={setDisplayPickImg}
            />
        );
    };

    const RenderPickImage = () => {
        if (displayPickImg) {
            return (
                <ModalPickImage
                    images={images}
                    setImages={setImages}
                    containerStyle={{
                        height: modalPickImgHeight,
                        backgroundColor: theme.backgroundColor,
                    }}
                />
            );
        }
        return null;
    };

    return (
        <>
            <StyleKeyboardAwareView
                containerStyle={{backgroundColor: theme.backgroundColor}}
                onGetKeyBoardHeight={(value: number) =>
                    setModalPickImgHeight(value - Metrics.safeBottomPadding)
                }>
                {RenderHeader()}
                {RenderListMessage()}
                {RenderImagePreview()}
                {RenderInput()}
            </StyleKeyboardAwareView>

            {RenderPickImage()}
        </>
    );
};

const styles = ScaledSheet.create({
    contentContainer: {
        flexGrow: 1,
        paddingBottom: '30@vs',
    },
    contentPart: {
        flex: 1,
    },
    iconCloud: {
        fontSize: '17@ms',
    },
    headerLeftBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLeft: {
        fontSize: '20@ms',
    },
    numberNewMessagesBox: {
        width: '13@s',
        height: '15@s',
        borderRadius: '10@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNewMessages: {
        fontSize: '11@ms',
    },
    // two image when choose send image
    twoImageInput: {
        width: '100%',
        height: '75@vs',
        paddingTop: '15@vs',
        paddingHorizontal: '20@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageInputView: {
        width: '47%',
        height: '100%',
    },
    imageInput: {
        width: '100%',
        height: '100%',
        borderRadius: '5@vs',
    },
    // icon blocked
    blockView: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: '20@vs',
    },
    blockImage: {
        width: '50@s',
        height: '50@s',
        resizeMode: 'contain',
    },
    deleteImageBox: {
        position: 'absolute',
        padding: '3@s',
        right: '-8@s',
        top: '-6@s',
        borderRadius: '10@s',
    },
    iconDeleteImage: {
        fontSize: '13@ms',
    },
});

export default ChatDetail;
