import {
    TypeBubblePalace,
    TypeChangeChatColor,
    TypeChangeGroupNameResponse,
    TypeChatMessageResponse,
    TypeChatMessageSend,
    TypeChatTagEnjoyResponse,
    TypeChatTagRequest,
    TypeChatTagResponse,
    TypeDeleteMessageResponse,
    TypeSeenMessageEnjoyResponse,
    TypeSeenMessageResponse,
    TypingResponse,
} from 'api/interface';
import {
    apiDeleteMessage,
    apiGetListChatTags,
    apiGetListMessages,
} from 'api/module';
import FindmeStore from 'app-redux/store';
import {
    MESSAGE_TYPE,
    RELATIONSHIP,
    SOCKET_EVENT,
    TYPE_BUBBLE_PALACE_ACTION,
} from 'asset/enum';
import {MESS_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import Config from 'react-native-config';
import {io, Socket} from 'socket.io-client';
import {
    countDownToCancelRequestPublic,
    isIOS,
    reorderListChatTag,
} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';
import usePaging from './usePaging';
import Redux from './useRedux';

let socket: Socket;
const socketDev = isIOS ? Config.API_SOCKET : 'http://10.0.2.2:3000';
const socketProduction = Config.API_SOCKET;
const socketUrl = __DEV__ ? socketDev : socketProduction;

class SocketClass {
    static start = () => {
        socket = io(socketUrl, {
            transports: ['websocket'],
            timeout: 2000,
        });
    };

    static close = () => {
        socket?.close();
    };
}

/** -----------------------------------
 *  Component container SocketProvider
 * ------------------------------------
 */
export const SocketProvider = ({children}: any) => {
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();

    const handleOnConnect = () => {
        if (token) {
            SocketClass.close();
            SocketClass.start();
            socket.on('connect', () => {
                if (!isModeExp) {
                    socket.emit(SOCKET_EVENT.authenticate, {
                        token,
                    });
                } else {
                    socket.emit(SOCKET_EVENT.authenticate, {
                        myId: FindmeStore.getState().accountSlice.passport
                            .profile.id,
                    });
                }
            });
        } else {
            SocketClass.close();
        }
    };

    const handleAppState = (e: AppStateStatus) => {
        if (e === 'active') {
            socket?.emit(SOCKET_EVENT.appActive, socket.id);
        } else if (e === 'background') {
            socket?.emit(SOCKET_EVENT.appBackground, socket.id);
        }
    };

    useEffect(() => {
        handleOnConnect();
    }, [token, isModeExp]);

    useEffect(() => {
        AppState.addEventListener('change', handleAppState);
        return () => AppState.removeEventListener('change', handleAppState);
    }, []);

    return <>{children}</>;
};

/**
 *
 */
/** ----------------------------------
 * THIS IS FOR USER HAVE ACCOUNT
 * ----------------------------------- /
 */
export const useSocketChatTagBubble = () => {
    const listChatTags = Redux.getListChatTag();
    const chatTagFocusing = Redux.getChatTagFocusing();
    const myId = Redux.getPassport().profile.id;

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListChatTags,
        params: {
            take: 20,
        },
    });

    let countdownRequestPublic: any;

    const hearingSocketBubble = () => {
        socket?.off(SOCKET_EVENT.createBubble);
        socket.on(SOCKET_EVENT.createBubble, (data: TypeBubblePalace) => {
            const relationship =
                data.creatorId === myId
                    ? RELATIONSHIP.self
                    : RELATIONSHIP.notKnow;

            if (relationship === RELATIONSHIP.notKnow) {
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.addNew,
                    payload: {
                        ...data,
                        relationship,
                    },
                });
                return;
            }

            if (relationship === RELATIONSHIP.self) {
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.addNew,
                    payload: {
                        ...data,
                        relationship,
                    },
                });
                return;
            }
        });

        socket?.off(SOCKET_EVENT.deleteBubble);
        socket.on(SOCKET_EVENT.deleteBubble, (bubbleId: string) => {
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.removeOne,
                payload: bubbleId,
            });
        });
    };

    const hearingOtherSocket = useCallback(() => {
        socket?.off(SOCKET_EVENT.createChatTag);
        socket?.on(SOCKET_EVENT.createChatTag, (data: TypeChatTagResponse) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return [data].concat(previousChatTags);
            });
            socket.emit(SOCKET_EVENT.joinRoom, data.id);
        });

        socket?.off(SOCKET_EVENT.seenMessage);
        socket.on(SOCKET_EVENT.seenMessage, (data: TypeSeenMessageResponse) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (item.id !== data.chatTagId) {
                        return item;
                    }
                    return {
                        ...item,
                        userSeenMessage: {
                            ...item.userSeenMessage,
                            ...data.data,
                        },
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.changeGroupName);
        socket.on(
            SOCKET_EVENT.changeGroupName,
            (data: TypeChangeGroupNameResponse) => {
                let indexNeedToReorder = -1;
                setList((previousChatTags: Array<TypeChatTagResponse>) => {
                    const temp = previousChatTags.map((item, index) => {
                        if (item.id !== data.chatTagId) {
                            return item;
                        }
                        indexNeedToReorder = index;
                        return {
                            ...item,
                            groupName: data.newName,
                        };
                    });

                    if (indexNeedToReorder > 0) {
                        const updateList = reorderListChatTag(
                            temp,
                            indexNeedToReorder,
                        );
                        return updateList;
                    }
                    return temp;
                });

                // if not found chat tag in list, call api get that
                if (indexNeedToReorder === -1) {
                    try {
                        // call api get chat tag with id
                    } catch (err) {
                        appAlert(err);
                    }
                }
            },
        );

        socket?.off(SOCKET_EVENT.changeChatColor);
        socket.on(SOCKET_EVENT.changeChatColor, (data: TypeChangeChatColor) => {
            let indexNeedToReorder = -1;
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                const temp = previousChatTags.map((item, index) => {
                    if (item.id !== data.chatTagId) {
                        return item;
                    }
                    indexNeedToReorder = index;
                    return {
                        ...item,
                        color: data.newColor,
                    };
                });

                if (indexNeedToReorder > 0) {
                    const updateList = reorderListChatTag(
                        temp,
                        indexNeedToReorder,
                    );
                    return updateList;
                }
                return temp;
            });

            // if not found chat tag in list, call api get that
            if (indexNeedToReorder === -1) {
                try {
                    // call api get chat tag with id
                } catch (err) {
                    appAlert(err);
                }
            }
        });

        // request public chat
        socket?.off(SOCKET_EVENT.requestPublicChat);
        socket.on(SOCKET_EVENT.requestPublicChat, (chatTagId: string) => {
            let indexNeedToReorder = -1;
            setList((previousChatTag: Array<TypeChatTagResponse>) => {
                const temp = previousChatTag.map((item, index) => {
                    if (item.id !== chatTagId) {
                        return item;
                    }
                    indexNeedToReorder = index;
                    return {
                        ...item,
                        isRequestingPublic: true,
                    };
                });

                if (indexNeedToReorder > 0) {
                    const updateList = reorderListChatTag(
                        temp,
                        indexNeedToReorder,
                    );
                    return updateList;
                }
                return temp;
            });

            // if not found chat tag in list, call api get that
            if (indexNeedToReorder === -1) {
                try {
                    // call api get chat tag with id
                } catch (err) {
                    appAlert(err);
                }
            }

            clearTimeout(countdownRequestPublic);
            countdownRequestPublic = countDownToCancelRequestPublic({
                chatTagId,
                setList,
            });
        });

        socket?.off(SOCKET_EVENT.allAgreePublicChat);
        socket.on(
            SOCKET_EVENT.allAgreePublicChat,
            (data: TypeChatTagResponse) => {
                setList((previousChatTags: Array<TypeChatTagResponse>) => {
                    const temp = previousChatTags.map(item => {
                        if (item.id !== data.id) {
                            return item;
                        }
                        return data;
                    });
                    return temp;
                });
                navigate(MESS_ROUTE.publicChatting, {
                    publicChatTag: data,
                });
            },
        );

        // block, stop chat
        socket?.off(SOCKET_EVENT.isBlocked);
        socket.on(SOCKET_EVENT.isBlocked, (data: Array<string>) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (!data.includes(item.id)) {
                        return item;
                    }
                    return {
                        ...item,
                        isBlock: true,
                    };
                });
            });
        });
        socket?.off(SOCKET_EVENT.unBlocked);
        socket.on(SOCKET_EVENT.unBlocked, (data: Array<string>) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (!data.includes(item.id)) {
                        return item;
                    }
                    return {
                        ...item,
                        isBlock: false,
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.stopConversation);
        socket.on(SOCKET_EVENT.stopConversation, (chatTagId: string) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (item.id !== chatTagId) {
                        return item;
                    }
                    return {
                        ...item,
                        isStop: true,
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.openConversation);
        socket.on(SOCKET_EVENT.openConversation, (chatTagId: string) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (item.id !== chatTagId) {
                        return item;
                    }
                    return {
                        ...item,
                        isStop: false,
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.typing);
        socket.on(SOCKET_EVENT.typing, (data: TypingResponse) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (item.id !== data.chatTagId) {
                        return item;
                    }
                    let userTyping: Array<number> = [];
                    if (item.userTyping) {
                        // check user had is list or not
                        const index = item.userTyping.findIndex(
                            typing => typing === data.userId,
                        );
                        if (index >= 0) {
                            userTyping = item.userTyping;
                        } else {
                            userTyping = item.userTyping.concat(data.userId);
                        }
                    } else {
                        userTyping = [data.userId];
                    }
                    return {
                        ...item,
                        userTyping,
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.unTyping);
        socket.on(SOCKET_EVENT.unTyping, (data: TypingResponse) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (item.id !== data.chatTagId || !item.userTyping) {
                        return item;
                    }
                    const userTyping = item.userTyping.filter(
                        typingId => typingId !== data.userId,
                    );
                    return {
                        ...item,
                        userTyping,
                    };
                });
            });
        });

        // message, when have not yet to chat detail
        socket?.off(SOCKET_EVENT.message);
        socket?.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
            setList((previousChatTag: Array<TypeChatTagResponse>) => {
                let indexNeedToReorder = 0;

                const temp = previousChatTag.map((item, index) => {
                    if (item.id !== data.chatTag) {
                        return item;
                    }
                    const updateItem = {
                        ...item,
                        userSeenMessage: {
                            ...item.userSeenMessage,
                            [String(myId)]: {
                                ...item.userSeenMessage[String(myId)],
                                isLatest: false,
                            },
                        },
                    };
                    indexNeedToReorder = index;
                    return {
                        ...updateItem,
                        updateTime: new Date(),
                    };
                });

                if (indexNeedToReorder > 0) {
                    const updateList = reorderListChatTag(
                        temp,
                        indexNeedToReorder,
                    );
                    return updateList;
                } else {
                    return temp;
                }
            });
        });
    }, [myId]);

    const checkDisplayNotification = () => {
        let newNumber = 0;
        for (let i = 0; i < listChatTags.length; i++) {
            if (
                !listChatTags[i].userSeenMessage[String(myId)]?.isLatest &&
                listChatTags[i].id !== chatTagFocusing
            ) {
                newNumber += 1;
            }
        }
        Redux.setNumberNewMessage(newNumber);
    };

    useEffect(() => {
        hearingSocketBubble();
    }, [myId]);

    useEffect(() => {
        hearingOtherSocket();
    }, [myId]);

    useEffect(() => {
        Redux.updateListChatTag(list);
    }, [list]);

    useEffect(() => {
        checkDisplayNotification();
    }, [listChatTags, myId]);

    const seenMessage = (chatTagId: string) => {
        socket.emit(SOCKET_EVENT.seenMessage, {myId, chatTagId});
    };

    return {
        listChatTags,
        refreshing,
        onRefresh,
        onLoadMore,
        setListChatTags: setList,
        seenMessage,
    };
};

export const useSocketChatDetail = (params: {
    isMyChatTag: boolean;
    setListChatTags: any;
}) => {
    const chatTagFocusing = Redux.getChatTagFocusing();
    const myId = Redux.getPassport().profile.id;

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListMessages,
        params: {
            chatTagId: chatTagFocusing,
            take: 30,
        },
    });

    const hearingSocket = useCallback(() => {
        socket?.off(SOCKET_EVENT.message);
        socket.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
            if (data.chatTag === chatTagFocusing) {
                // if senderId is me
                // only need remove the tag of message local before
                if (data.senderId === myId) {
                    setList(
                        (previousMessages: Array<TypeChatMessageResponse>) => {
                            const temp = previousMessages.map(item => {
                                if (item?.tag !== data?.tag) {
                                    return item;
                                }
                                return {
                                    ...data,
                                    relationship: RELATIONSHIP.self,
                                };
                            });
                            return temp;
                        },
                    );
                    if (params.isMyChatTag) {
                        socket.emit(SOCKET_EVENT.seenMessage, {
                            myId,
                            chatTagId: data.chatTag,
                        });
                    }
                }

                // if senderId not me, set messages
                else if (data.senderId !== myId) {
                    setList(
                        (previousMessages: Array<TypeChatMessageResponse>) => {
                            return [
                                {...data, relationship: RELATIONSHIP.notKnow},
                            ].concat(previousMessages);
                        },
                    );
                    socket.emit(SOCKET_EVENT.seenMessage, {
                        myId,
                        chatTagId: data.chatTag,
                    });
                }
            }

            // reorder list chat tag, set it to first
            params.setListChatTags(
                (previousChatTags: Array<TypeChatTagResponse>) => {
                    let indexNeedToReorder = 0;
                    const temp = previousChatTags.map((item, index) => {
                        if (item.id !== data.chatTag) {
                            return item;
                        }
                        let updateItem = item;
                        // if message received, you're not in it's chat tag
                        // set your status isLatest = false
                        if (item.id !== chatTagFocusing) {
                            updateItem = {
                                ...item,
                                userSeenMessage: {
                                    ...item.userSeenMessage,
                                    [String(myId)]: {
                                        ...item.userSeenMessage[String(myId)],
                                        isLatest: false,
                                    },
                                },
                            };
                        }
                        indexNeedToReorder = index;
                        return {
                            ...updateItem,
                            updateTime: new Date(),
                        };
                    });

                    if (indexNeedToReorder > 0) {
                        return reorderListChatTag(temp, indexNeedToReorder);
                    } else {
                        return temp;
                    }
                },
            );
        });

        socket?.off(SOCKET_EVENT.deleteMessage);
        socket.on(
            SOCKET_EVENT.deleteMessage,
            (data: TypeDeleteMessageResponse) => {
                console.log('delete: ', data);
                if (data.chatTagId === chatTagFocusing) {
                    setList(
                        (previousMessages: Array<TypeChatMessageResponse>) => {
                            return previousMessages.filter(
                                item => item.id !== data.messageId,
                            );
                        },
                    );
                }
            },
        );
    }, [chatTagFocusing, myId]);

    useEffect(() => {
        hearingSocket();
    }, [chatTagFocusing, myId]);

    const sendMessage = useCallback(async (_params: TypeChatMessageSend) => {
        const newMessage: any = {
            id: _params.tag,
            chatTag: _params.chatTag,
            type: _params.type,
            content: _params.content,
            senderId: _params.senderId,
            senderAvatar: _params.senderAvatar,
            createdTime: _params.tag,
            tag: _params.tag,
            relationship: RELATIONSHIP.self,
        };
        setList((previousMessages: Array<TypeChatMessageResponse>) => {
            return [newMessage].concat(previousMessages);
        });

        if (_params.type === MESSAGE_TYPE.image) {
            const arrayImages: any = _params.content;
            try {
                const messImages = await ImageUploader.upLoadManyImg(
                    arrayImages,
                    1080,
                );
                _params.content = messImages;
            } catch (err) {
                appAlert(err);
                return;
            }
        }

        socket.emit(SOCKET_EVENT.message, _params);
    }, []);

    const deleteMessage = useCallback(
        async (idMessage: string) => {
            try {
                await apiDeleteMessage({
                    chatTagId: chatTagFocusing,
                    messageId: idMessage,
                });
                setList((previousMessage: Array<TypeChatMessageResponse>) => {
                    return previousMessage.filter(
                        item => item.id !== idMessage,
                    );
                });
                socket.emit(SOCKET_EVENT.deleteMessage, {
                    chatTagId: chatTagFocusing,
                    messageId: idMessage,
                });
            } catch (err) {
                appAlert(err);
            }
        },
        [chatTagFocusing],
    );

    return {
        messages: list,
        sendMessage,
        deleteMessage,
        refreshing,
        onRefresh,
        onLoadMore,
    };
};

/**
 *
 */
/** ----------------------------------
 * THIS IS FOR USER ENJOY MODE
 * ----------------------------------- /
 */
export const useSocketChatTagBubbleEnjoy = () => {
    const listChatTag = Redux.getListChatTag();
    const chatTagFocusing = Redux.getChatTagFocusing();
    const listMessageEnjoy = Redux.getListMessagesEnjoy();
    const myId = Redux.getPassport().profile.id;

    const hearingSocketBubble = () => {
        socket?.off(SOCKET_EVENT.createBubble);
        socket.on(SOCKET_EVENT.createBubble, (data: TypeBubblePalace) => {
            const relationship =
                data.creatorId === myId
                    ? RELATIONSHIP.self
                    : RELATIONSHIP.notKnow;
            const canNotInteract = data.creatorId > 0;

            if (relationship === RELATIONSHIP.notKnow) {
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.addNew,
                    payload: {
                        ...data,
                        relationship,
                        canNotInteract,
                    },
                });
                return;
            }

            if (relationship === RELATIONSHIP.self) {
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.addNew,
                    payload: {
                        ...data,
                        relationship,
                    },
                });
                return;
            }
        });

        socket?.off(SOCKET_EVENT.deleteBubble);
        socket.on(SOCKET_EVENT.deleteBubble, (bubbleId: string) => {
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.removeOne,
                payload: bubbleId,
            });
        });
    };

    const hearingOtherSocket = () => {
        socket?.off(SOCKET_EVENT.createChatTag);
        socket.on(
            SOCKET_EVENT.createChatTag,
            (data: TypeChatTagEnjoyResponse) => {
                const temp = FindmeStore.getState().logicSlice.listChatTag;
                Redux.updateListChatTag([data.newChatTag].concat(temp));
                Redux.startNewMessageEnjoy({
                    chatTagId: data.newChatTag.id,
                    newMessage: {
                        ...data.newMessage,
                        relationship:
                            data.newMessage.senderId === myId
                                ? RELATIONSHIP.self
                                : RELATIONSHIP.notKnow,
                    },
                });
                socket.emit(SOCKET_EVENT.joinRoom, data.newChatTag.id);
            },
        );

        socket?.off(SOCKET_EVENT.changeGroupName);
        socket.on(
            SOCKET_EVENT.changeGroupName,
            (data: TypeChangeGroupNameResponse) => {
                const currentListChatTag =
                    FindmeStore.getState().logicSlice.listChatTag;
                const temp = currentListChatTag.map(item => {
                    if (item.id !== data.chatTagId) {
                        return item;
                    }
                    return {
                        ...item,
                        groupName: data.newName,
                    };
                });
                Redux.updateListChatTag(temp);
            },
        );
    };

    const hearingSocketTyping = () => {
        socket?.off(SOCKET_EVENT.typing);
        socket.on(SOCKET_EVENT.typing, (data: TypingResponse) => {
            const temp = listChatTag.map(item => {
                if (item.id !== data.chatTagId) {
                    return item;
                }
                let userTyping: Array<number> = [];
                // check user had is list or not
                if (item.userTyping) {
                    const index = item.userTyping.findIndex(
                        userId => userId === data.userId,
                    );
                    if (index >= 0) {
                        userTyping = item.userTyping;
                    } else {
                        userTyping = item.userTyping.concat(data.userId);
                    }
                } else {
                    userTyping = [data.userId];
                }
                return {
                    ...item,
                    userTyping,
                };
            });
            Redux.updateListChatTag(temp);
        });

        socket?.off(SOCKET_EVENT.unTyping);
        socket.on(SOCKET_EVENT.unTyping, (data: TypingResponse) => {
            const temp = listChatTag.map(item => {
                if (item.id !== data.chatTagId || !item.userTyping) {
                    return item;
                }
                const userTyping = item.userTyping.filter(
                    userId => userId !== data.userId,
                );
                return {
                    ...item,
                    userTyping,
                };
            });
            Redux.updateListChatTag(temp);
        });
    };

    const hearingSocketMessage = () => {
        socket?.off(SOCKET_EVENT.seenMessage);
        socket.on(
            SOCKET_EVENT.seenMessage,
            (data: TypeSeenMessageEnjoyResponse) => {
                let latestMessage = '';
                // find latest message
                const messageFind = listMessageEnjoy.find(
                    item => item.chatTag === data.chatTagId,
                );
                latestMessage =
                    messageFind?.messages.find(
                        item => item.senderId !== data.userSeen,
                    )?.id ||
                    messageFind?.messages.find(
                        item => item.senderId === data.userSeen,
                    )?.id ||
                    '';

                const temp = listChatTag.map(item => {
                    if (item.id !== data.chatTagId) {
                        return item;
                    }
                    return {
                        ...item,
                        userSeenMessage: {
                            ...item.userSeenMessage,
                            [String(data.userSeen)]: {
                                latestMessage,
                                isLatest: true,
                            },
                        },
                    };
                });
                Redux.updateListChatTag(temp);
            },
        );

        socket?.off(SOCKET_EVENT.messageEnjoy);
        socket.on(
            SOCKET_EVENT.messageEnjoy,
            (data: TypeChatMessageResponse) => {
                const relationship =
                    data.senderId === myId
                        ? RELATIONSHIP.self
                        : RELATIONSHIP.notKnow;
                Redux.addNewMessageEnjoy({
                    chatTag: data.chatTag,
                    newMessage: {
                        ...data,
                        relationship,
                    },
                });

                let indexNeedToReorder = 0;
                const temp = listChatTag.map((item, index) => {
                    if (item.id !== data.chatTag) {
                        return item;
                    }
                    indexNeedToReorder = index;
                    return {
                        ...item,
                        userSeenMessage: {
                            ...item.userSeenMessage,
                            [String(myId)]: {
                                ...item.userSeenMessage[String(myId)],
                                isLatest: false,
                            },
                        },
                    };
                });

                if (indexNeedToReorder > 0) {
                    const updateList = reorderListChatTag(
                        temp,
                        indexNeedToReorder,
                    );
                    Redux.updateListChatTag(updateList);
                } else {
                    Redux.updateListChatTag(temp);
                }
            },
        );
    };

    const checkDisplayNotification = () => {
        let newNumber = 0;
        for (let i = 0; i < listChatTag.length; i++) {
            if (
                !listChatTag[i].userSeenMessage[String(myId)]?.isLatest &&
                listChatTag[i].id !== chatTagFocusing
            ) {
                newNumber += 1;
            }
        }
        Redux.setNumberNewMessage(newNumber);
    };

    useEffect(() => {
        hearingSocketBubble();
    }, []);

    useEffect(() => {
        hearingOtherSocket();
    }, []);

    useEffect(() => {
        hearingSocketTyping();
    }, [listChatTag]);

    useEffect(() => {
        if (!chatTagFocusing) {
            hearingSocketMessage();
        }
    }, [chatTagFocusing, listChatTag, listMessageEnjoy]);

    useEffect(() => {
        checkDisplayNotification();
    }, [chatTagFocusing, listChatTag]);

    const seenMessage = (chatTagId: string) => {
        socket.emit(SOCKET_EVENT.seenMessage, {myId, chatTagId, isEnjoy: true});
    };

    return {
        listChatTags: listChatTag,
        refreshing: false,
        onRefresh: () => null,
        onLoadMore: () => null,
        setListChatTags: () => null,
        seenMessage,
    };
};

export const useSocketChatDetailEnjoy = (params: {isMyChatTag: boolean}) => {
    const myId = Redux.getPassport().profile.id;
    const chatTagFocusing = Redux.getChatTagFocusing();
    const listChatTag = Redux.getListChatTag();
    const listMessageEnjoy = Redux.getListMessagesEnjoy();

    const messageObject = useMemo(() => {
        return listMessageEnjoy.find(item => item.chatTag === chatTagFocusing);
    }, [chatTagFocusing]);

    const [messages, setMessages] = useState(messageObject?.messages || []);

    const hearingSocket = () => {
        socket?.off(SOCKET_EVENT.messageEnjoy);
        socket.on(
            SOCKET_EVENT.messageEnjoy,
            (data: TypeChatMessageResponse) => {
                if (data.chatTag === chatTagFocusing) {
                    if (data.senderId === myId) {
                        setMessages(
                            (
                                previousMessages: Array<TypeChatMessageResponse>,
                            ) => {
                                const temp = previousMessages.map(item => {
                                    if (item?.tag !== data?.tag) {
                                        return item;
                                    }
                                    return {
                                        ...data,
                                        relationship: RELATIONSHIP.self,
                                    };
                                });
                                return temp;
                            },
                        );
                        if (params.isMyChatTag) {
                            socket.emit(SOCKET_EVENT.seenMessage, {
                                myId,
                                chatTagId: data.chatTag,
                                isEnjoy: true,
                            });
                        }
                    }

                    // if senderId not me, set messages
                    else if (data.senderId !== myId) {
                        setMessages(
                            (
                                previousMessages: Array<TypeChatMessageResponse>,
                            ) => {
                                return [
                                    {
                                        ...data,
                                        relationship: RELATIONSHIP.notKnow,
                                    },
                                ].concat(previousMessages);
                            },
                        );
                        socket.emit(SOCKET_EVENT.seenMessage, {
                            myId,
                            chatTagId: data.chatTag,
                            isEnjoy: true,
                        });
                    }
                }
                // message not in chatTagFocusing
                else {
                    const relationship =
                        data.senderId === myId
                            ? RELATIONSHIP.self
                            : RELATIONSHIP.notKnow;
                    Redux.addNewMessageEnjoy({
                        chatTag: data.chatTag,
                        newMessage: {
                            ...data,
                            relationship,
                        },
                    });
                }

                // reorder list chat tag, set it to first
                let indexNeedToReorder = 0;
                const temp = listChatTag.map((item, index) => {
                    if (item.id !== data.chatTag) {
                        return item;
                    }
                    let updateItem = item;
                    // if message received, you're not in it's chat tag
                    // set your status isLatest = false
                    if (item.id !== chatTagFocusing) {
                        updateItem = {
                            ...item,
                            userSeenMessage: {
                                ...item.userSeenMessage,
                                [String(myId)]: {
                                    ...item.userSeenMessage[String(myId)],
                                    isLatest: false,
                                },
                            },
                        };
                    }
                    indexNeedToReorder = index;
                    return {
                        ...updateItem,
                        updateTime: new Date(),
                    };
                });
                if (indexNeedToReorder > 0) {
                    const updateList = reorderListChatTag(
                        temp,
                        indexNeedToReorder,
                    );
                    Redux.updateListChatTag(updateList);
                } else {
                    Redux.updateListChatTag(temp);
                }
            },
        );
    };

    const hearingSocketSeenMessage = () => {
        socket?.off(SOCKET_EVENT.seenMessage);
        socket.on(
            SOCKET_EVENT.seenMessage,
            (data: TypeSeenMessageEnjoyResponse) => {
                let latestMessage = '';
                // find latest message
                if (data.chatTagId !== chatTagFocusing) {
                    const messageFind = listMessageEnjoy.find(
                        item => item.chatTag === data.chatTagId,
                    );
                    latestMessage =
                        messageFind?.messages.find(
                            item => item.senderId !== data.userSeen,
                        )?.id ||
                        messageFind?.messages.find(
                            item => item.senderId === data.userSeen,
                        )?.id ||
                        '';
                } else {
                    latestMessage =
                        messages?.find(item => item.senderId !== data.userSeen)
                            ?.id ||
                        messages?.find(item => item.senderId === data.userSeen)
                            ?.id ||
                        '';
                }

                const temp = listChatTag.map(item => {
                    if (item.id !== data.chatTagId) {
                        return item;
                    }
                    return {
                        ...item,
                        userSeenMessage: {
                            ...item.userSeenMessage,
                            [String(data.userSeen)]: {
                                latestMessage,
                                isLatest: true,
                            },
                        },
                    };
                });
                Redux.updateListChatTag(temp);
            },
        );
    };

    useEffect(() => {
        hearingSocket();
    }, [listChatTag, chatTagFocusing]);

    useEffect(() => {
        hearingSocketSeenMessage();
    }, [listMessageEnjoy, listChatTag, chatTagFocusing, messages]);

    const sendMessage = (_params: TypeChatMessageSend) => {
        const newMessage: any = {
            id: _params.tag,
            chatTag: _params.chatTag,
            type: _params.type,
            content: _params.content,
            senderId: _params.senderId,
            senderAvatar: _params.senderAvatar,
            createdTime: _params.tag,
            tag: _params.tag,
            relationship: RELATIONSHIP.self,
        };
        setMessages([newMessage].concat(messages));

        socket.emit(SOCKET_EVENT.messageEnjoy, _params);
    };

    const deleteMessage = async (idMessage: string) => {
        setMessages((previousMessage: Array<TypeChatMessageResponse>) => {
            return previousMessage.filter(item => item.id !== idMessage);
        });
    };

    return {
        messages,
        sendMessage,
        deleteMessage,
        refreshing: false,
        onRefresh: () => null,
        onLoadMore: () => null,
    };
};

/**
 *
 */
/** ----------------------------------
 * HELPER FUNCTION
 * -----------------------------------
 */
export const startChatTag = (params: {
    token: any;
    newChatTag: TypeChatTagRequest;
}) => {
    socket.emit(SOCKET_EVENT.createChatTag, params);
};
export const startChatTagEnjoy = (params: {
    myId: any;
    newChatTag: TypeChatTagRequest;
}) => {
    socket.emit(SOCKET_EVENT.createChatTag, params);
};

export const requestPublicChat = (chatTagId: string) => {
    socket.emit(SOCKET_EVENT.requestPublicChat, chatTagId);
};
export const agreePublicChat = (chatTagId: string) => {
    const token = FindmeStore.getState().logicSlice.token;
    socket.emit(SOCKET_EVENT.agreePublicChat, {token, chatTagId});
};

export const blockAllChatTag = (params: {
    listUserId: Array<number>;
    listChatTagId: Array<string>;
}) => {
    socket.emit(SOCKET_EVENT.isBlocked, params);
};
export const unBlockAllChatTag = (params: {
    listUserId: Array<number>;
    listChatTagId: Array<string>;
}) => {
    socket.emit(SOCKET_EVENT.unBlocked, params);
};

export const stopChatTag = (chatTagId: string) => {
    socket.emit(SOCKET_EVENT.stopConversation, chatTagId);
};
export const openChatTag = (chatTagId: string) => {
    socket.emit(SOCKET_EVENT.openConversation, chatTagId);
};

export const pushBubble = (params: {myId: string; bubble: any}) => {
    socket.emit(SOCKET_EVENT.createBubble, params);
};

export const changeGroupName = (params: {
    chatTagId: string;
    newName: string;
}) => {
    socket.emit(SOCKET_EVENT.changeGroupName, {
        token: FindmeStore.getState().logicSlice.token,
        ...params,
    });
};

export const changeChatTheme = (params: {
    newColor: number;
    chatTagId: string;
}) => {
    socket.emit(SOCKET_EVENT.changeChatColor, {
        token: FindmeStore.getState().logicSlice.token,
        ...params,
    });
};

export const socketTyping = (params: TypingResponse) => {
    socket.emit(SOCKET_EVENT.typing, params);
};
export const socketUnTyping = (params: TypingResponse) => {
    socket.emit(SOCKET_EVENT.unTyping, params);
};

export const closeSocket = () => {
    SocketClass.close();
};
