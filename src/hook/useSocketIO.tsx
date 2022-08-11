import {
    TypeSocketCommentRequest,
    TypeBubblePalace,
    TypeChangeChatColor,
    TypeChangeGroupNameResponse,
    TypeChatMessageResponse,
    TypeChatMessageSend,
    TypeChatTagResponse,
    TypeCommentResponse,
    TypeConversationRequest,
    TypeCreatePostResponse,
    TypeDeleteMessageResponse,
    TypeNotificationResponse,
    TypeSeenMessageResponse,
    TypeSocketCommentResponse,
    TypingResponse,
} from 'api/interface';
import {
    apiDeleteMessage,
    apiGetListComments,
    apiGetListConversations,
    apiGetListMessages,
    apiGetListNotifications,
} from 'api/module';
import FindmeStore from 'app-redux/store';
import {
    CONVERSATION_STATUS,
    MESSAGE_TYPE,
    RELATIONSHIP,
    SOCKET_EVENT,
} from 'asset/enum';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import Config from 'react-native-config';
import {io, Socket} from 'socket.io-client';
import {isIOS, reorderListChatTag} from 'utility/assistant';
import {isTimeBefore} from 'utility/format';
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

    const handleOnConnect = () => {
        if (token) {
            SocketClass.close();
            SocketClass.start();
            socket.on('connect', () => {
                socket.emit(SOCKET_EVENT.authenticate, {
                    token,
                });
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
    }, [token]);

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
    const myId = Redux.getPassport().profile.id;
    const token = Redux.getToken();

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListConversations,
        params: {
            take: 20,
        },
    });

    const hearingSocket = () => {
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
                    if (item.id !== data.conversationId) {
                        return item;
                    }
                    return {
                        ...item,
                        userData: {
                            ...item.userData,
                            ...data.data,
                        },
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.changeChatName);
        socket.on(
            SOCKET_EVENT.changeChatName,
            (data: TypeChangeGroupNameResponse) => {
                let indexNeedToReorder = -1;
                setList((previousChatTags: Array<TypeChatTagResponse>) => {
                    const temp = previousChatTags.map((item, index) => {
                        if (item.id !== data.conversationId) {
                            return item;
                        }
                        indexNeedToReorder = index;
                        return {
                            ...item,
                            conversationName: data.name,
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
                    if (item.id !== data.conversationId) {
                        return item;
                    }
                    indexNeedToReorder = index;
                    return {
                        ...item,
                        color: data.color,
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
                        isBlocked: true,
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
                        isBlocked: false,
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
                        status: CONVERSATION_STATUS.stop,
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
                        status: CONVERSATION_STATUS.active,
                    };
                });
            });
        });

        socket?.off(SOCKET_EVENT.typing);
        socket.on(SOCKET_EVENT.typing, (data: TypingResponse) => {
            setList((previousChatTags: Array<TypeChatTagResponse>) => {
                return previousChatTags.map(item => {
                    if (item.id !== data.conversationId) {
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
                    if (item.id !== data.conversationId || !item.userTyping) {
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
                    if (item.id !== data.conversationId) {
                        return item;
                    }
                    const latestMessage =
                        typeof data.content === 'string'
                            ? data.content
                            : 'Image';
                    indexNeedToReorder = index;
                    return {
                        ...item,
                        modified: data.created,
                        latestMessage,
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
        });
    };

    const checkDisplayNotification = () => {
        let newNumber = 0;
        for (let i = 0; i < listChatTags.length; i++) {
            if (
                isTimeBefore(
                    listChatTags[i].userData[String(myId)].modified,
                    listChatTags[i].modified,
                )
            ) {
                newNumber += 1;
            }
        }
        Redux.setNumberNewMessage(newNumber);
    };

    useEffect(() => {
        if (token && socket) {
            hearingSocket();
        }
    }, [token, socket]);

    useEffect(() => {
        Redux.updateListChatTag(list);
    }, [list]);

    useEffect(() => {
        checkDisplayNotification();
    }, [listChatTags, myId]);

    const seenMessage = (conversationId: string) => {
        socket.emit(SOCKET_EVENT.seenMessage, {myId, conversationId});
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

/**
 * Chat detail
 */
const deleteMessage = async (idMessage: string) => {
    try {
        await apiDeleteMessage(idMessage);
    } catch (err) {
        appAlert(err);
    }
};

const listMessageEvents = [
    MESSAGE_TYPE.changeColor,
    MESSAGE_TYPE.changeName,
    MESSAGE_TYPE.joinCommunity,
];

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

    const hearingSocket = () => {
        socket?.off(SOCKET_EVENT.message);
        socket.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
            const isFocusingThisChatTag =
                data.conversationId === chatTagFocusing;
            if (isFocusingThisChatTag) {
                if (data.creator === myId) {
                    setList(
                        (previousMessages: Array<TypeChatMessageResponse>) => {
                            if (listMessageEvents.includes(data.type)) {
                                const temp: TypeChatMessageResponse = {
                                    ...data,
                                    tag: undefined,
                                    relationship: RELATIONSHIP.self,
                                };
                                return [temp].concat(previousMessages);
                            }
                            return previousMessages.map(item => {
                                if (item?.tag !== data?.tag) {
                                    return item;
                                }
                                return {
                                    ...data,
                                    tag: undefined,
                                    relationship: RELATIONSHIP.self,
                                };
                            });
                        },
                    );
                    // We'll take after this problem
                    // Because if sender is me, not need to send socket "seenMessage" any more, only need set userData in local

                    // if (params.isMyChatTag) {
                    //     socket.emit(SOCKET_EVENT.seenMessage, {
                    //         myId,
                    //         conversationId: data.conversationId,
                    //     });
                    // }
                }

                // if senderId not me, set messages
                else if (data.creator !== myId) {
                    setList(
                        (previousMessages: Array<TypeChatMessageResponse>) => {
                            const temp: TypeChatMessageResponse = {
                                ...data,
                                tag: undefined,
                                relationship: RELATIONSHIP.notKnow,
                            };
                            return [temp].concat(previousMessages);
                        },
                    );
                }
            }

            // reorder list chat tag, set it to first
            params.setListChatTags(
                (previousChatTags: Array<TypeChatTagResponse>) => {
                    let indexNeedToReorder = 0;
                    const temp = previousChatTags.map((item, index) => {
                        if (item.id !== data.conversationId) {
                            return item;
                        }
                        const latestMessage =
                            typeof data.content === 'string'
                                ? data.content
                                : 'Image';
                        indexNeedToReorder = index;
                        return {
                            ...item,
                            modified: data.created,
                            latestMessage,
                        };
                    });

                    if (indexNeedToReorder > 0) {
                        return reorderListChatTag(temp, indexNeedToReorder);
                    }
                    return temp;
                },
            );

            if (isFocusingThisChatTag) {
                socket.emit(SOCKET_EVENT.seenMessage, {
                    myId,
                    conversationId: data.conversationId,
                });
            }
        });

        socket?.off(SOCKET_EVENT.deleteMessage);
        socket.on(
            SOCKET_EVENT.deleteMessage,
            (data: TypeDeleteMessageResponse) => {
                if (data.conversationId === chatTagFocusing) {
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
    };

    useEffect(() => {
        hearingSocket();
    }, [chatTagFocusing, myId]);

    const sendMessage = async (_params: TypeChatMessageSend) => {
        const newMessage: TypeChatMessageResponse = {
            id: _params.tag,
            conversationId: _params.conversationId,
            type: _params.type,
            content: _params.content,
            creator: _params.creator,
            creatorName: _params.creatorName,
            creatorAvatar: _params.creatorAvatar,
            created: undefined,
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
                socket.emit(SOCKET_EVENT.message, _params);
            } catch (err) {
                appAlert(err);
            }
        } else {
            socket.emit(SOCKET_EVENT.message, _params);
        }
    };

    return {
        messages: list,
        sendMessage,
        deleteMessage,
        refreshing,
        onRefresh,
        onLoadMore,
    };
};

/** -----------------------------------
 *          SOCKET COMMENT
 -----------------------------------  */
interface ParamSocketComment {
    bubbleFocusing: TypeBubblePalace | TypeCreatePostResponse;
    scrollToEnd(): void;
}

export const useSocketComment = (params: ParamSocketComment) => {
    const {bubbleFocusing, scrollToEnd} = params;
    const [oldBubbleId, setOldBubbleId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataComment, setDataComment] = useState<Array<TypeCommentResponse>>(
        [],
    );

    const getData = async () => {
        try {
            setIsLoading(true);
            const res = await apiGetListComments(bubbleFocusing.id);
            setDataComment(res.data);

            let totalComments = res.data.length;
            res.data.forEach(item => {
                if (item.listCommentsReply) {
                    totalComments += item.listCommentsReply?.length;
                }
            });
            Redux.updateBubbleFocusing({
                totalComments,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            setIsLoading(false);
        }
    };

    const hearingSocket = () => {
        socket?.off(SOCKET_EVENT.addComment);
        socket.on(
            SOCKET_EVENT.addComment,
            (data: TypeSocketCommentResponse) => {
                if (data.commentReplied) {
                    setDataComment(preValue =>
                        preValue.map(item => {
                            if (item.id !== data.commentReplied) {
                                return item;
                            }
                            return {
                                ...item,
                                listCommentsReply:
                                    item.listCommentsReply?.concat(data.data),
                            };
                        }),
                    );
                } else {
                    setDataComment(preValue => preValue.concat(data.data));
                }
                // Create a pull request to handle this later
                scrollToEnd();
                Redux.increaseTotalCommentsOfBubbleFocusing(1);
            },
        );
    };

    useEffect(() => {
        if (bubbleFocusing.id && bubbleFocusing.id !== oldBubbleId) {
            getData();
            socket.emit(SOCKET_EVENT.joinRoom, bubbleFocusing.id);
            hearingSocket();
            if (oldBubbleId) {
                socket.emit(SOCKET_EVENT.leaveRoom, oldBubbleId);
            }
            setOldBubbleId(bubbleFocusing.id);
        }
    }, [bubbleFocusing.id, oldBubbleId]);

    return {
        list: dataComment,
        onRefresh: getData,
        loading: isLoading,
    };
};

export const useSocketNotification = () => {
    const {list, setList, onRefresh, onLoadMore, refreshing} = usePaging({
        request: apiGetListNotifications,
        params: {
            take: 30,
        },
    });

    const hearingSocket = () => {
        socket?.off(SOCKET_EVENT.notification);
        socket.on(
            SOCKET_EVENT.notification,
            (data: TypeNotificationResponse) => {
                setList((preValue: Array<TypeNotificationResponse>) => {
                    return [data].concat(preValue);
                });
            },
        );
    };

    useEffect(() => {
        hearingSocket();
    }, []);

    return {
        list,
        setList,
        onRefresh,
        refreshing,
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

/**
 *
 */
/** ----------------------------------
 * HELPER FUNCTION
 * -----------------------------------
 */
export const startChatTag = (conversation: TypeConversationRequest) => {
    const {token} = FindmeStore.getState().logicSlice;
    socket.emit(SOCKET_EVENT.createChatTag, {
        token,
        conversation,
    });
};

export const socketTyping = (params: TypingResponse) => {
    socket.emit(SOCKET_EVENT.typing, params);
};
export const socketUnTyping = (params: TypingResponse) => {
    socket.emit(SOCKET_EVENT.unTyping, params);
};

export const socketAddComment = (params: TypeSocketCommentRequest) => {
    socket.emit(SOCKET_EVENT.addComment, params);
};

export const socketJoinRoom = (roomId: string) => {
    socket.emit(SOCKET_EVENT.joinRoom, roomId);
};

export const socketLeaveRoom = (roomId: string) => {
    socket.emit(SOCKET_EVENT.leaveRoom, roomId);
};

export const closeSocket = () => {
    SocketClass.close();
};
