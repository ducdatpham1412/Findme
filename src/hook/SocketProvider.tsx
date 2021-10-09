// import {API_SOCKET} from '@env';
// import {
//     TypeBubblePalace,
//     TypeChatMessageResponse,
//     TypeChatMessageSend,
//     TypeChatTagRequest,
//     TypeChatTagResponse,
//     TypeMyBubbles,
// } from 'api/interface';
// import {apiGetListMessages} from 'api/module';
// import FindmeStore from 'app-redux/store';
// import {RELATIONSHIP, SOCKET_EVENT} from 'asset/enum';
// import {appAlert} from 'navigation/NavigationService';
// import React, {useEffect, useMemo, useState} from 'react';
// import SocketIO, {Socket} from 'socket.io-client';
// import Redux from './useRedux';

// let socket: Socket;

// const SocketProvider = ({children}: any) => {
//     const token = Redux.getToken();
//     const myId = Redux.getPassport().profile.id;

//     const connectSocket = () => {
//         socket = SocketIO(API_SOCKET, {
//             transports: ['websocket'],
//             timeout: 100,
//         });
//     };

//     const handleOnConnect = async () => {
//         socket.emit(SOCKET_EVENT.authenticate, {token});

//         socket.on(SOCKET_EVENT.un_authorized, async () => {
//             // try {
//             //     await apiGetPassport();
//             // } catch (err) {
//             //     appAlert(err);
//             // }
//         });

//         socket.on(SOCKET_EVENT.bubble, (data: TypeBubblePalace) => {
//             Redux.addBubblePalace({
//                 ...data,
//                 relationship:
//                     data.creatorId === myId
//                         ? RELATIONSHIP.self
//                         : RELATIONSHIP.notKnow,
//             });
//         });
//     };

//     const startSocket = () => {
//         socket?.disconnect();
//         connectSocket();

//         socket?.on('connect', () => {
//             handleOnConnect();
//         });
//     };

//     useEffect(() => {
//         if (token) {
//             startSocket();
//         }
//     }, [token]);

//     return <>{children}</>;
// };

// /**
//  * Chat tag and Bubble
//  */

// export const sendBubblePalace = (params: TypeMyBubbles) => {
//     socket.emit(SOCKET_EVENT.bubble, params);
// };

// export const useSocketChatTagBubble = () => {
//     const listChatTags = Redux.getListChatTag();
//     const chatTagFocusing = Redux.getChatTagFocusing();

//     // console.log('hearing chat tag');

//     socket.on(SOCKET_EVENT.chatTag, (data: TypeChatTagResponse) => {
//         if (!listChatTags.filter(item => item.id === data.id).length) {
//             Redux.updateListChatTag(
//                 listChatTags.concat({
//                     ...data,
//                     hasNewMessage: true,
//                 }),
//             );
//         }
//         // else update chat tag
//         else {
//             const temp = listChatTags.map(item => {
//                 if (item.id === data.id) {
//                     return {
//                         ...data,
//                         hasNewMessage: true,
//                     };
//                 }
//                 return item;
//             });
//             Redux.updateListChatTag(temp);
//         }
//     });

//     socket.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
//         // only update chat tag if user not in chatDetail of this chat tag
//         if (chatTagFocusing !== data.chatTag) {
//             const temp = listChatTags.map(item => {
//                 if (item.id === data.chatTag) {
//                     return {
//                         ...item,
//                         hasNewMessage: true,
//                     };
//                 } else {
//                     return item;
//                 }
//             });
//             Redux.updateListChatTag(temp);
//         }
//     });

//     const sendChatTag = (params: TypeChatTagRequest) => {
//         socket.emit(SOCKET_EVENT.chatTag, params);
//     };

//     return {
//         listChatTags,
//         sendChatTag,
//     };
// };

// /**
//  * Chat message
//  */
// export const useSocketChatDetail = (chatTagId: string) => {
//     const myId = useMemo(() => {
//         return FindmeStore.getState().accountSlice.passport.profile.id;
//     }, []);

//     const [messages, setMessages] = useState<Array<TypeChatMessageResponse>>(
//         [],
//     );

//     const getListMessage = async () => {
//         try {
//             const res = await apiGetListMessages(chatTagId);

//             const temp = res.data.map(item => {
//                 if (item.senderId === myId) {
//                     return {
//                         ...item,
//                         relationship: RELATIONSHIP.self,
//                     };
//                 }
//                 return {
//                     ...item,
//                     relationship: RELATIONSHIP.notKnow,
//                 };
//             });

//             setMessages(temp);
//         } catch (err) {
//             appAlert(err);
//         }
//     };

//     useEffect(() => {
//         getListMessage();
//     }, []);

//     socket.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
//         setMessages(
//             [
//                 {
//                     ...data,
//                     relationship:
//                         data.senderId === myId
//                             ? RELATIONSHIP.self
//                             : RELATIONSHIP.notKnow,
//                 },
//             ].concat(messages),
//         );
//     });

//     const sendMessage = (params: TypeChatMessageSend) => {
//         socket.emit(SOCKET_EVENT.message, params);
//     };

//     return {
//         messages,
//         sendMessage,
//     };
// };

// export default SocketProvider;
