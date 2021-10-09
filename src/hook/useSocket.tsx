import {API_SOCKET} from '@env';
import {
    TypeBubblePalace,
    TypeChatMessageResponse,
    TypeChatMessageSend,
    TypeChatTagRequest,
    TypeChatTagResponse,
} from 'api/interface';
import {apiGetListMessages} from 'api/module';
import FindmeStore from 'app-redux/store';
import {RELATIONSHIP, SOCKET_EVENT} from 'asset/enum';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect, useMemo, useState} from 'react';
import Redux from './useRedux';

let bubbleChatTagSocket: WebSocket;
let chatSocket: WebSocket;
interface TypeSocketOn {
    event: any;
    function(data: any): void;
}

class SocketClass {
    static listEvent: Array<TypeSocketOn> = [];

    static myEvent: any = {};
    static chatEvent: any;

    static start = (id: number) => {
        bubbleChatTagSocket = new WebSocket(
            `ws://${API_SOCKET}/ws/doffy-socket/bubble-chattag/${id}`,
        );
        chatSocket = new WebSocket(
            `ws://${API_SOCKET}/ws/doffy-socket/chat-detail/${id}`,
        );
    };

    static on = (event: string, callBackFunction: any) => {
        if (event === SOCKET_EVENT.message) {
            SocketClass.chatEvent = callBackFunction;
            return;
        }
        // bubble and chat tag
        SocketClass.myEvent[event] = callBackFunction;
    };

    // bubble and chat tag have "event"
    // to determine type because these use the same socket
    static emitBubble = (data: any) => {
        bubbleChatTagSocket.send(
            JSON.stringify({
                event: SOCKET_EVENT.bubble,
                data,
            }),
        );
    };

    static emitChatTag = (data: any) => {
        bubbleChatTagSocket.send(
            JSON.stringify({
                event: SOCKET_EVENT.chatTag,
                data,
            }),
        );
    };

    // chat not need event because it have its own socket
    static emitChat = (data: any) => {
        chatSocket.send(JSON.stringify(data));
    };

    static close = () => {
        bubbleChatTagSocket.close();
        chatSocket.close();
    };
}

/**
 * Component Socket Provider
 */
export const SocketProvider = memo(({children}: any) => {
    const token = Redux.getToken();
    const id = Redux.getPassport().profile?.id;
    const chatTagFocusing = Redux.getChatTagFocusing();
    const listChatTag = Redux.getListChatTag();

    const hearingBubbleChatTag = () => {
        if (bubbleChatTagSocket) {
            bubbleChatTagSocket.onmessage = e => {
                const event = JSON.parse(e.data).event;
                const data = JSON.parse(e.data).data;

                SocketClass.myEvent[event]?.(data);
            };
        }
    };

    const hearingChatDetail = () => {
        if (chatSocket) {
            chatSocket.onmessage = e => {
                const data: TypeChatMessageResponse = JSON.parse(e.data);

                SocketClass.chatEvent?.(data);

                if (data.chatTag !== chatTagFocusing) {
                    const temp = listChatTag.map(item => {
                        if (item.id === data.chatTag) {
                            return {
                                ...item,
                                hasNewMessage: true,
                            };
                        }
                        return item;
                    });
                    Redux.updateListChatTag(temp);
                }
            };
        }
    };

    useEffect(() => {
        if (token && token !== 'logout' && id) {
            SocketClass.start(id);
            hearingBubbleChatTag();
        }

        // this is for press log out
        else if (token === 'logout') {
            SocketClass.close();
        }
    }, [token]);

    useEffect(() => {
        hearingChatDetail();
    }, [chatTagFocusing]);

    return <>{children}</>;
});

/**
 * BubblePalace and ChatTag
 */
export const useSocketChatTagBubble = () => {
    const listChatTags = Redux.getListChatTag();
    const myId = useMemo(() => {
        return FindmeStore.getState().accountSlice.passport.profile.id;
    }, []);

    // logger('hearing chat tag');

    SocketClass.on(SOCKET_EVENT.bubble, (data: TypeBubblePalace) => {
        Redux.addBubblePalace({
            ...data,
            relationship:
                data.creatorId == myId
                    ? RELATIONSHIP.self
                    : RELATIONSHIP.notKnow,
        });
    });

    SocketClass.on(SOCKET_EVENT.chatTag, (data: TypeChatTagResponse) => {
        if (!listChatTags.filter(item => item.id === data.id).length) {
            Redux.updateListChatTag(
                listChatTags.concat({
                    ...data,
                    hasNewMessage: true,
                }),
            );
        }
        // update chat tag
        else {
            const temp = listChatTags.map(item => {
                if (item.id === data.id) {
                    return {
                        ...data,
                        hasNewMessage: true,
                    };
                } else {
                    return item;
                }
            });
            Redux.updateListChatTag(temp);
        }
    });

    SocketClass.on(SOCKET_EVENT.requestPublicChat, (chatTagId: string) => {
        if (listChatTags.filter(item => item.id === chatTagId)) {
            const temp = listChatTags.map(item => {
                if (item.id !== chatTagId) {
                    return item;
                } else {
                    return {
                        ...item,
                        isRequestingPublic: true,
                        updateTime: new Date(),
                    };
                }
            });
            Redux.updateListChatTag(temp);
        } else {
            // api find chat tag
            // set again
        }
    });

    return {
        listChatTags,
    };
};

export const sendBubblePalace = (params: any) => {
    SocketClass.emitBubble(params);
};

export const startNewChatTag = (params: TypeChatTagRequest) => {
    SocketClass.emitChatTag(params);
};

/**
 * Detail Chat
 */
export const useSocketChatDetail = (chatTagId: string) => {
    const myId = useMemo(() => {
        return FindmeStore.getState().accountSlice.passport.profile.id;
    }, []);

    const [messages, setMessages] = useState<Array<TypeChatMessageResponse>>(
        [],
    );

    // logger('hearing chat detail');

    const getListMessage = async () => {
        try {
            const res = await apiGetListMessages(chatTagId);
            const temp = res.data.map(item => {
                if (item.senderId === myId) {
                    return {
                        ...item,
                        relationship: RELATIONSHIP.self,
                    };
                }
                return {
                    ...item,
                    relationship: RELATIONSHIP.notKnow,
                };
            });
            setMessages(temp);
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getListMessage();
    }, []);

    SocketClass.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
        if (data.chatTag === chatTagId) {
            setMessages(
                [
                    {
                        ...data,
                        relationship:
                            data.senderId === myId
                                ? RELATIONSHIP.self
                                : RELATIONSHIP.notKnow,
                    },
                ].concat(messages),
            );
        }
    });

    return {
        messages,
    };
};

export const sendMessage = (params: TypeChatMessageSend) => {
    SocketClass.emitChat(params);
};
