// import {useIsFocused} from '@react-navigation/core';
// import {
//     TypeBubblePalace,
//     TypeChangeGroupNameResponse,
//     TypeChatMessageResponse,
//     TypeChatMessageSend,
//     TypeChatTagEnjoyResponse,
//     TypeChatTagResponse,
//     TypeSeenMessageEnjoyResponse,
//     TypeSeenMessageResponse,
// } from 'api/interface';
// import {
//     apiDeleteMessage,
//     apiGetListChatTags,
//     apiGetListMessages,
// } from 'api/module';
// import {MESSAGE_TYPE, RELATIONSHIP, SOCKET_EVENT} from 'asset/enum';
// import {MESS_ROUTE} from 'navigation/config/routes';
// import {appAlert, navigate} from 'navigation/NavigationService';
// import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
// import Config from 'react-native-config';
// import {
//     countDownToCancelRequestPublic,
//     reorderListChatTag,
// } from 'utility/assistant';
// import ImageUploader from 'utility/ImageUploader';
// import usePaging from './usePaging';
// import Redux from './useRedux';

// let bubbleChatTagSocket: WebSocket;
// let chatSocket: WebSocket;

// export class SocketClass {
//     static myEvent: any = {};
//     static chatEvent: any;

//     static start = (id: number) => {
//         bubbleChatTagSocket = new WebSocket(
//             `ws://${Config.API_SOCKET}/ws/doffy-socket/bubble-chattag/${id}`,
//         );
//         chatSocket = new WebSocket(
//             `ws://${Config.API_SOCKET}/ws/doffy-socket/chat-detail/${id}`,
//         );
//     };

//     static on = (event: string, callBackFunction: any) => {
//         if (event === SOCKET_EVENT.message) {
//             SocketClass.chatEvent = callBackFunction;
//             return;
//         }
//         // bubble and chat tag
//         SocketClass.myEvent[event] = callBackFunction;
//     };

//     static emitSeenMessage = (userId: any, chatTagId: string) => {
//         bubbleChatTagSocket?.send(
//             JSON.stringify({
//                 event: SOCKET_EVENT.seenMessage,
//                 data: {
//                     user: userId,
//                     chatTag: chatTagId,
//                 },
//             }),
//         );
//     };

//     static emitSeenMessageEnjoy = (params: {
//         userSeen: number | string;
//         listUser: Array<any>;
//         chatTagId: string;
//     }) => {
//         bubbleChatTagSocket?.send(
//             JSON.stringify({
//                 event: SOCKET_EVENT.seenMessage,
//                 data: params,
//             }),
//         );
//     };

//     static close = () => {
//         bubbleChatTagSocket?.close();
//         chatSocket?.close();
//     };
// }

// /** -----------------------------------
//  *  Component container SocketProvider
//  * ------------------------------------
//  */
// export const SocketProvider = memo(({children}: any) => {
//     const token = Redux.getToken();
//     const myId = Redux.getPassport().profile?.id;
//     const isModeExp = Redux.getModeExp();

//     const chatTagFocusing = Redux.getChatTagFocusing();
//     const listChatTag = Redux.getListChatTag();

//     const hearingBubbleChatTag = () => {
//         if (bubbleChatTagSocket) {
//             bubbleChatTagSocket.onmessage = e => {
//                 const event = JSON.parse(e.data).event;
//                 const data = JSON.parse(e.data).data;

//                 SocketClass.myEvent[event]?.(data);
//             };
//         }
//     };

//     const hearingChatDetail = () => {
//         if (chatSocket) {
//             chatSocket.onmessage = e => {
//                 const data: TypeChatMessageResponse = JSON.parse(e.data);

//                 // if not in this chat tag, set isLatest = false to me
//                 let indexNeedToReorder = 0;
//                 const temp = listChatTag.map((item, index) => {
//                     if (item.id !== data.chatTag) {
//                         return item;
//                     } else {
//                         let updateItem = item;
//                         // if not in this chat tag, mark it is not read
//                         if (item.id !== chatTagFocusing) {
//                             updateItem = {
//                                 ...item,
//                                 userSeenMessage: {
//                                     ...item.userSeenMessage,
//                                     [String(myId)]: {
//                                         ...item.userSeenMessage[String(myId)],
//                                         isLatest: false,
//                                     },
//                                 },
//                             };
//                         }
//                         indexNeedToReorder = index;
//                         return {
//                             ...updateItem,
//                             updateTime: new Date(),
//                         };
//                     }
//                 });
//                 if (indexNeedToReorder > 0) {
//                     const updateList = reorderListChatTag(
//                         temp,
//                         indexNeedToReorder,
//                     );
//                     Redux.updateListChatTag(updateList);
//                 } else {
//                     Redux.updateListChatTag(temp);
//                 }

//                 // handle set message in chat detail
//                 SocketClass.chatEvent?.(data);
//             };
//         }
//     };

//     useEffect(() => {
//         if (token) {
//             SocketClass.close();
//             if (isModeExp) {
//                 if (myId && String(myId).includes('__')) {
//                     SocketClass.start(myId);
//                 }
//             } else {
//                 if (myId && myId > 0) {
//                     SocketClass.start(myId);
//                 }
//             }
//             hearingBubbleChatTag();
//         }

//         // this is for press log out
//         else if (!token) {
//             SocketClass.close();
//         }
//     }, [token, myId, isModeExp]);

//     useEffect(() => {
//         hearingChatDetail();
//     }, [chatTagFocusing, listChatTag, token]);

//     return <>{children}</>;
// });

// /**
//  *
//  */
// /** ----------------------------------
//  * THIS IS FOR USER IN ENJOY MODE
//  * ----------------------------------- /

// /**
//  * BubblePalace and Message for enjoyMode
//  */
// export const useSocketBubbleEnjoy = () => {
//     const listChatTags = Redux.getListChatTag();
//     const chatTagFocusing = Redux.getChatTagFocusing();
//     const myId = Redux.getPassport().profile.id;
//     let x: any;
//     let y: any;

//     const [shouldReceiveOtherBubble, setShouldReceiveOtherBubble] =
//         useState(true);
//     const [shouldReceiveMyBubble, setShouldReceiveMyBubble] = useState(true);

//     const hearingBubbleSocket = () => {
//         SocketClass.on(SOCKET_EVENT.createBubble, (data: TypeBubblePalace) => {
//             const relationship =
//                 data.creatorId === myId
//                     ? RELATIONSHIP.self
//                     : RELATIONSHIP.notKnow;
//             const canNotInteract = data.creatorId > 0;

//             if (
//                 relationship !== RELATIONSHIP.self &&
//                 shouldReceiveOtherBubble
//             ) {
//                 Redux.addBubblePalace({
//                     ...data,
//                     relationship,
//                     canNotInteract,
//                 });
//                 setShouldReceiveOtherBubble(false);
//                 x = setTimeout(() => {
//                     setShouldReceiveOtherBubble(true);
//                 }, 3000);
//                 return () => clearTimeout(x);
//             }

//             if (relationship === RELATIONSHIP.self && shouldReceiveMyBubble) {
//                 Redux.addBubblePalace({
//                     ...data,
//                     relationship,
//                     canNotInteract,
//                 });
//                 setShouldReceiveMyBubble(false);
//                 y = setTimeout(() => {
//                     setShouldReceiveMyBubble(true);
//                 }, 6000);
//                 return () => clearTimeout(y);
//             }
//         });

//         SocketClass.on(SOCKET_EVENT.deleteBubble, (data: string) => {
//             Redux.removeABubblePalace(data);
//         });
//     };

//     const hearingOthersSocket = () => {
//         SocketClass.on(
//             SOCKET_EVENT.createChatTag,
//             (data: TypeChatTagEnjoyResponse) => {
//                 // set chat tag
//                 Redux.updateListChatTag([data.newChatTag].concat(listChatTags));

//                 // start a new message
//                 Redux.startNewMessageEnjoy({
//                     chatTagId: data.newChatTag.id,
//                     newMessage: data.newMessage,
//                 });
//             },
//         );

//         SocketClass.on(
//             SOCKET_EVENT.changeGroupName,
//             (data: TypeChangeGroupNameResponse) => {
//                 const temp = listChatTags.map(item => {
//                     if (item.id !== data.chatTagId) {
//                         return item;
//                     }
//                     return {
//                         ...item,
//                         groupName: data.newName,
//                     };
//                 });
//                 Redux.updateListChatTag(temp);
//             },
//         );
//     };

//     const checkDisplayNotification = () => {
//         let newNumber = 0;
//         for (let i = 0; i < listChatTags.length; i++) {
//             if (
//                 !listChatTags[i].userSeenMessage[String(myId)]?.isLatest &&
//                 listChatTags[i].id !== chatTagFocusing
//             ) {
//                 newNumber += 1;
//             }
//         }
//         Redux.setNumberNewMessage(newNumber);
//     };

//     useEffect(() => {
//         hearingBubbleSocket();
//     }, [shouldReceiveOtherBubble, shouldReceiveMyBubble]);

//     useEffect(() => {
//         hearingOthersSocket();
//         checkDisplayNotification();
//     }, [listChatTags, myId]);

//     const seenMessage = (chatTagId: string, listUserId?: Array<any>) => {
//         if (listUserId) {
//             SocketClass.emitSeenMessageEnjoy({
//                 userSeen: myId,
//                 listUser: listUserId,
//                 chatTagId,
//             });
//         }
//     };

//     return {
//         listChatTags,
//         seenMessage,
//         onLoadMore: () => null,
//         onRefresh: () => null,
//         refreshing: false,
//         setListChatTags: () => null,
//     };
// };

// /**
//  * Detail chat
//  */
// export const useSocketChatEnjoy = (params: {
//     isMyChatTag: boolean;
//     listUserId: Array<any>;
// }) => {
//     const myId = Redux.getPassport().profile.id;
//     const chatTagFocusing = Redux.getChatTagFocusing();
//     const listChatTag = Redux.getListChatTag();
//     const listMessageEnjoy = Redux.getListMessagesEnjoy();

//     const messageObject = useMemo(() => {
//         return listMessageEnjoy.find(item => item.chatTag === chatTagFocusing);
//     }, [chatTagFocusing]);

//     const [messages, setMessages] = useState(messageObject?.messages || []);
//     const isFocused = useIsFocused();

//     const hearingSocket = () => {
//         SocketClass.on(
//             SOCKET_EVENT.message,
//             (data: TypeChatMessageResponse) => {
//                 if (data.chatTag === chatTagFocusing) {
//                     // if message is of me
//                     // only need remove the tag of message local before
//                     if (data.senderId === myId) {
//                         const temp = messages.map(item => {
//                             if (item?.tag !== data?.tag) {
//                                 return item;
//                             }
//                             return {
//                                 ...data,
//                                 relationship: RELATIONSHIP.self,
//                             };
//                         });
//                         setMessages(temp);
//                         if (params.isMyChatTag) {
//                             SocketClass.emitSeenMessageEnjoy({
//                                 userSeen: myId,
//                                 listUser: params.listUserId,
//                                 chatTagId: chatTagFocusing,
//                             });
//                         }
//                     }
//                     // if not, add message to list
//                     else {
//                         setMessages(
//                             [
//                                 {
//                                     ...data,
//                                     relationship: RELATIONSHIP.notKnow,
//                                 },
//                             ].concat(messages),
//                         );
//                         SocketClass.emitSeenMessageEnjoy({
//                             userSeen: myId,
//                             listUser: params.listUserId,
//                             chatTagId: chatTagFocusing,
//                         });
//                     }
//                 }

//                 // if data chatTag inn't in focusing
//                 // set it in redux
//                 else {
//                     Redux.addNewMessageEnjoy({
//                         chatTag: data.chatTag,
//                         newMessage: data,
//                     });
//                 }
//             },
//         );

//         SocketClass.on(
//             SOCKET_EVENT.seenMessage,
//             (data: TypeSeenMessageEnjoyResponse) => {
//                 if (data.chatTagId === chatTagFocusing) {
//                     const temp = listChatTag.map(item => {
//                         if (item.id !== data.chatTagId) {
//                             return item;
//                         }

//                         const latestMessage =
//                             messages.find(_item => {
//                                 return params.isMyChatTag
//                                     ? _item.senderId === data.userSeen
//                                     : _item.senderId !== data.userSeen;
//                             })?.id || '';

//                         const checkChatTag = {
//                             ...item,
//                             userSeenMessage: {
//                                 ...item.userSeenMessage,
//                                 [String(data.userSeen)]: {
//                                     latestMessage,
//                                     isLatest: true,
//                                 },
//                             },
//                         };

//                         return checkChatTag;
//                     });

//                     Redux.updateListChatTag(temp);
//                 }
//             },
//         );
//     };

//     const updateListMessageEnjoy = () => {
//         if (!isFocused) {
//             const temp = listMessageEnjoy.map(item => {
//                 if (item.chatTag !== chatTagFocusing) {
//                     return item;
//                 }
//                 return {
//                     chatTag: item.chatTag,
//                     messages: messages,
//                 };
//             });
//             Redux.updateListMessageEnjoy(temp);
//         }
//     };

//     useEffect(() => {
//         hearingSocket();
//     }, [messages, listMessageEnjoy, listChatTag]);

//     useEffect(() => {
//         updateListMessageEnjoy();
//     }, [isFocused, messages]);

//     const sendMessage = (_params: TypeChatMessageSend) => {
//         const newMessage: any = {
//             id: _params.tag,
//             chatTag: _params.chatTag,
//             type: _params.type,
//             content: _params.content,
//             senderId: _params.senderId,
//             senderAvatar: _params.senderAvatar,
//             createdTime: _params.tag,
//             tag: _params.tag,
//             relationship: RELATIONSHIP.self,
//         };
//         setMessages([newMessage].concat(messages));

//         chatSocket?.send(JSON.stringify(_params));
//     };

//     const deleteMessage = async (idMessage: string) => {
//         const temp = messages.filter(item => item.id !== idMessage);
//         setMessages(temp);
//     };

//     return {
//         messages,
//         sendMessage,
//         deleteMessage,
//         refreshing: false,
//         onRefresh: () => null,
//         onLoadMore: () => null,
//     };
// };

// /**
//  *
//  */
// /** ----------------------------------
//  * THIS IS FOR USER HAVE ACCOUNT
//  * ----------------------------------- /

// /**
//  * BubblePalace and ChatTag
//  */
// export const useSocketChatTagBubble = () => {
//     const bubbles = Redux.getBubblePalace();
//     const listChatTags = Redux.getListChatTag();
//     const chatTagFocusing = Redux.getChatTagFocusing();
//     const myId = Redux.getPassport().profile.id;

//     let x: any;
//     let y: any;
//     let z: any;

//     const {list, setList, onLoadMore, onRefresh, refreshing} = usePaging({
//         request: apiGetListChatTags,
//         params: {
//             take: 20,
//         },
//     });

//     const [shouldReceiveOtherBubble, setShouldReceiveOtherBubble] =
//         useState(true);
//     const [shouldReceiveMyBubble, setShouldReceiveMyBubble] = useState(true);

//     const seenMessage = (chatTagId: string) => {
//         SocketClass.emitSeenMessage(myId, chatTagId);
//     };

//     const hearingSocketBubble = () => {
//         SocketClass.on(SOCKET_EVENT.createBubble, (data: TypeBubblePalace) => {
//             const relationship =
//                 data.creatorId === myId
//                     ? RELATIONSHIP.self
//                     : RELATIONSHIP.notKnow;

//             if (
//                 relationship === RELATIONSHIP.notKnow &&
//                 shouldReceiveOtherBubble
//             ) {
//                 Redux.addBubblePalace({
//                     ...data,
//                     relationship,
//                 });
//                 setShouldReceiveOtherBubble(false);
//                 y = setTimeout(() => {
//                     setShouldReceiveOtherBubble(true);
//                 }, 3000);
//                 return () => clearTimeout(y);
//             }

//             if (relationship === RELATIONSHIP.self && shouldReceiveMyBubble) {
//                 Redux.addBubblePalace({
//                     ...data,
//                     relationship,
//                 });
//                 setShouldReceiveMyBubble(false);
//                 z = setTimeout(() => {
//                     setShouldReceiveMyBubble(true);
//                 }, 3000);
//                 return () => clearTimeout(z);
//             }
//         });

//         SocketClass.on(SOCKET_EVENT.deleteBubble, (data: string) => {
//             Redux.removeABubblePalace(data);
//         });
//     };

//     const hearingOthersSocket = () => {
//         SocketClass.on(
//             SOCKET_EVENT.createChatTag,
//             (data: TypeChatTagResponse) => {
//                 if (!listChatTags.filter(item => item.id === data.id).length) {
//                     setList([data].concat(listChatTags));
//                 }
//                 // update a chat tag, this is for send from profile
//                 else {
//                     const temp = listChatTags.map(item => {
//                         if (item.id !== data.id) {
//                             return item;
//                         }

//                         const updateItem = {...item};
//                         updateItem.userSeenMessage[String(myId)].isLatest =
//                             false;
//                         return updateItem;
//                     });
//                     setList(temp);
//                 }
//             },
//         );

//         SocketClass.on(SOCKET_EVENT.requestPublicChat, (chatTagId: string) => {
//             if (listChatTags.filter(item => item.id === chatTagId)) {
//                 const temp = listChatTags.map(item => {
//                     if (item.id !== chatTagId) {
//                         return item;
//                     } else {
//                         return {
//                             ...item,
//                             isRequestingPublic: true,
//                         };
//                     }
//                 });
//                 setList(temp);

//                 // countdown to set back to none
//                 clearTimeout(x);
//                 x = countDownToCancelRequestPublic({
//                     chatTagId,
//                     setList,
//                 });
//             } else {
//                 // api find chat tag
//                 // set again
//             }
//         });

//         SocketClass.on(
//             SOCKET_EVENT.isBlocked,
//             (listChatTagBlocked: Array<string>) => {
//                 const temp = listChatTags.map(item => {
//                     if (!listChatTagBlocked.includes(item.id)) {
//                         return item;
//                     }
//                     return {
//                         ...item,
//                         isBlock: true,
//                     };
//                 });
//                 setList(temp);
//             },
//         );

//         SocketClass.on(
//             SOCKET_EVENT.unBlocked,
//             (listChatTagUnBlocked: Array<string>) => {
//                 const temp = listChatTags.map(item => {
//                     if (!listChatTagUnBlocked.includes(item.id)) {
//                         return item;
//                     }
//                     return {
//                         ...item,
//                         isBlock: false,
//                     };
//                 });
//                 setList(temp);
//             },
//         );

//         SocketClass.on(SOCKET_EVENT.stopConversation, (chatTagId: string) => {
//             const temp = listChatTags.map(item => {
//                 if (item.id !== chatTagId) {
//                     return item;
//                 }
//                 return {
//                     ...item,
//                     isStop: true,
//                 };
//             });
//             setList(temp);
//         });

//         SocketClass.on(SOCKET_EVENT.openConversation, (chatTagId: string) => {
//             const temp = listChatTags.map(item => {
//                 if (item.id !== chatTagId) {
//                     return item;
//                 }
//                 return {
//                     ...item,
//                     isStop: false,
//                 };
//             });
//             setList(temp);
//         });

//         SocketClass.on(
//             SOCKET_EVENT.changeGroupName,
//             (data: TypeChangeGroupNameResponse) => {
//                 const temp = listChatTags.map(item => {
//                     if (item.id !== data.chatTagId) {
//                         return item;
//                     }
//                     return {
//                         ...item,
//                         groupName: data.newName,
//                     };
//                 });
//                 setList(temp);
//             },
//         );
//     };

//     const checkDisplayNotification = () => {
//         let newNumber = 0;
//         for (let i = 0; i < listChatTags.length; i++) {
//             if (
//                 !listChatTags[i].userSeenMessage[String(myId)]?.isLatest &&
//                 listChatTags[i].id !== chatTagFocusing
//             ) {
//                 newNumber += 1;
//             }
//         }
//         Redux.setNumberNewMessage(newNumber);
//     };

//     useEffect(() => {
//         hearingSocketBubble();
//     }, [shouldReceiveOtherBubble, shouldReceiveMyBubble, bubbles]);

//     useEffect(() => {
//         hearingOthersSocket();
//         checkDisplayNotification();
//     }, [listChatTags, myId]);

//     useEffect(() => {
//         Redux.updateListChatTag(list);
//     }, [list]);

//     return {
//         listChatTags,
//         seenMessage,
//         onLoadMore,
//         onRefresh,
//         refreshing,
//         setListChatTags: setList,
//     };
// };

// /**
//  * Detail Chat
//  */
// export const useSocketChatDetail = (params: {isMyChatTag: boolean}) => {
//     const myId = Redux.getPassport().profile.id;
//     const chatTagFocusing = Redux.getChatTagFocusing();
//     let x: any;

//     const listChatTag = Redux.getListChatTag();

//     const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
//         request: apiGetListMessages,
//         params: {
//             chatTagId: chatTagFocusing,
//             take: 30,
//         },
//     });

//     const hearingSocket = () => {
//         SocketClass.on(
//             SOCKET_EVENT.message,
//             (data: TypeChatMessageResponse) => {
//                 if (data.chatTag === chatTagFocusing) {
//                     // if senderId is me
//                     // only need remove the tag of message local before
//                     if (data.senderId === myId) {
//                         const temp = list.map(item => {
//                             if (item?.tag !== data?.tag) {
//                                 return item;
//                             }
//                             return {
//                                 ...data,
//                                 relationship: RELATIONSHIP.self,
//                             };
//                         });
//                         setList(temp);
//                         if (params.isMyChatTag) {
//                             SocketClass.emitSeenMessage(myId, chatTagFocusing);
//                         }
//                     }
//                     // if senderId not me, set messages
//                     else if (data.senderId !== myId) {
//                         setList(
//                             [
//                                 {
//                                     ...data,
//                                     relationship: RELATIONSHIP.notKnow,
//                                 },
//                             ].concat(list),
//                         );
//                         SocketClass.emitSeenMessage(myId, chatTagFocusing);
//                     }
//                 }
//             },
//         );

//         SocketClass.on(
//             SOCKET_EVENT.allAgreePublicChat,
//             (data: TypeChatTagResponse) => {
//                 clearTimeout(x);
//                 const temp = listChatTag.map(item => {
//                     if (item.id !== data.id) {
//                         return item;
//                     }
//                     return data;
//                 });
//                 Redux.updateListChatTag(temp);
//                 navigate(MESS_ROUTE.publicChatting, {
//                     publicChatTag: data,
//                 });
//             },
//         );

//         // Seen message
//         SocketClass.on(
//             SOCKET_EVENT.seenMessage,
//             (data: TypeSeenMessageResponse) => {
//                 if (data.chatTagId === chatTagFocusing) {
//                     const temp = listChatTag.map(item => {
//                         if (item.id !== chatTagFocusing) {
//                             return item;
//                         }
//                         return {
//                             ...item,
//                             userSeenMessage: {
//                                 ...item.userSeenMessage,
//                                 ...data.data,
//                             },
//                         };
//                     });
//                     Redux.updateListChatTag(temp);
//                 }
//             },
//         );
//     };

//     useEffect(() => {
//         hearingSocket();
//     }, [list, chatTagFocusing, listChatTag]);

//     const sendMessage = async (_params: TypeChatMessageSend) => {
//         const newMessage: any = {
//             id: _params.tag,
//             chatTag: _params.chatTag,
//             type: _params.type,
//             content: _params.content,
//             senderId: _params.senderId,
//             senderAvatar: _params.senderAvatar,
//             createdTime: _params.tag,
//             tag: _params.tag,
//             relationship: RELATIONSHIP.self,
//         };
//         setList([newMessage].concat(list));

//         if (_params.type === MESSAGE_TYPE.image) {
//             const arrayImages: any = _params.content;
//             try {
//                 const messImages = await ImageUploader.upLoadManyImg(
//                     arrayImages,
//                     1080,
//                 );
//                 _params.content = messImages;
//             } catch (err) {
//                 appAlert(err);
//                 return;
//             }
//         }

//         chatSocket?.send(JSON.stringify(_params));
//     };

//     const deleteMessage = useCallback(
//         async (idMessage: string) => {
//             try {
//                 await apiDeleteMessage(idMessage);
//                 const temp = list.filter(item => item.id !== idMessage);
//                 setList(temp);
//             } catch (err) {
//                 appAlert(err);
//             }
//         },
//         [list],
//     );

//     return {
//         messages: list,
//         sendMessage,
//         deleteMessage,
//         refreshing,
//         onRefresh,
//         onLoadMore,
//     };
// };
