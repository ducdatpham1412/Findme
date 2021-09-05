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
import {logger} from 'utility/assistant';
import Redux from './useRedux';

let socket: WebSocket;
// let socket = new WebSocket(`ws://${API_SOCKET}/ws/doffy-socket/${0}`);
logger('init socket');

interface TypeSocketOn {
    event: any;
    function(data: any): void;
}

class SocketClass {
    static listEvent: Array<TypeSocketOn> = [];

    static start = (id: number) => {
        socket = new WebSocket(
            `ws://${'127.0.0.1:8000'}/ws/doffy-socket/${id}`,
        );
    };

    static on = (event: any, callBackFunction: any) => {
        for (let i = 0; i < SocketClass.listEvent.length; i++) {
            if (SocketClass.listEvent[i].event === event) {
                SocketClass.listEvent[i] = {
                    event,
                    function: callBackFunction,
                };
                return;
            }
        }

        SocketClass.listEvent.push({
            event,
            function: callBackFunction,
        });
    };

    static emit = (inputEvent: any, data: any) => {
        socket.send(
            JSON.stringify({
                event: inputEvent,
                data,
            }),
        );
    };

    static close = () => {
        socket.close();
    };
}

/**
 * Component Socket Provider
 */
export const SocketProvider = memo(({children}: any) => {
    const token = Redux.getToken();
    const id = Redux.getPassport().profile?.id;

    const hearing = () => {
        socket.onmessage = e => {
            const event = JSON.parse(e.data).event;
            const data = JSON.parse(e.data).data;

            SocketClass.listEvent.forEach(item => {
                if (item.event === event) {
                    console.log(item.event);
                    item.function(data);
                }
            });
        };
    };

    useEffect(() => {
        if (token && token !== 'logout' && id) {
            SocketClass.start(id);
            hearing();
        }

        // this is for press log out
        else if (token === 'logout') {
            SocketClass.close();
        }
    }, [token]);

    return <>{children}</>;
});

/**
 * BubblePalace and ChatTag
 */
export const useSocketListChatTag = () => {
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

    SocketClass.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
        const temp = listChatTags.map(item => {
            if (item.id === data.chatTag) {
                return {
                    ...item,
                    hasNewMessage: true,
                };
            } else {
                return item;
            }
        });
        Redux.updateListChatTag(temp);
    });

    const startNewChatTag = (params: TypeChatTagRequest) => {
        SocketClass.emit(SOCKET_EVENT.chatTag, params);
    };

    return {
        listChatTags,
        startNewChatTag,
    };
};

export const socketSendMyBubble = (params: any) => {
    SocketClass.emit(SOCKET_EVENT.bubble, params);
};

/**
 * Detail Chat
 */
export const useSocketChatDetail = (chatTagId: string) => {
    const listChatTags = Redux.getListChatTag();
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
        // else update status of chat tag other
        else {
            const temp = listChatTags.map(item => {
                if (item.id === data.chatTag) {
                    return {
                        ...item,
                        hasNewMessage: true,
                    };
                } else {
                    return item;
                }
            });
            Redux.updateListChatTag(temp);
        }
    });

    SocketClass.on(SOCKET_EVENT.chatTag, (data: TypeChatTagResponse) => {
        if (data.id !== chatTagId) {
            const temp = listChatTags.map(item => {
                if (item.id === data.id) {
                    return {
                        ...item,
                        hasNewMessage: true,
                    };
                } else {
                    return item;
                }
            });
            Redux.updateListChatTag(temp);
        }
    });

    SocketClass.on(SOCKET_EVENT.bubble, (data: TypeBubblePalace) => {
        Redux.addBubblePalace({
            ...data,
            relationship:
                data.creatorId == myId
                    ? RELATIONSHIP.self
                    : RELATIONSHIP.notKnow,
        });
    });

    const sendMessage = (params_: TypeChatMessageSend) => {
        // formData here
        SocketClass.emit(SOCKET_EVENT.message, params_);
    };

    return {
        messages,
        sendMessage,
    };
};
