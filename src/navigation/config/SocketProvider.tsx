/*eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {apiGetProfile, getAllListMessage} from 'api/module';
import {eventSocket} from 'asset/name';
import useRedux from 'hook/useRedux';
import {useEffect} from 'react';
import io from 'socket.io-client';
import {formateMessage} from 'utility/format';

const socket = io('API_SOCKET', {timeout: 3000});

// COMPONENT SOCKET_PROVIDER
export const SocketProvider = ({children}: any) => {
    const token = useRedux().getToken();

    const handleOnConnect = async () => {
        socket.emit(eventSocket.authenticate, {token});
        socket.on(eventSocket.unauthorized, async () => {
            await apiGetProfile();
            socket.emit(eventSocket.authenticate, {token});
        });
    };

    const startSocket = () => {
        socket?.disconnect();
        socket.on(eventSocket.connect, () => {
            handleOnConnect();
        });
        socket.on(eventSocket.authenticated, () => {
            console.log('yeah, connected');
        });
        socket.connect();
    };

    const stopSocket = () => {
        socket?.off(eventSocket.connect);
        socket?.off(eventSocket.unauthorized);
        socket?.off(eventSocket.authenticated);
        socket?.disconnect();
    };

    useEffect(() => {
        if (token) {
            startSocket();
        }
        return () => {
            stopSocket();
        };
    }, [token]);

    return <>{children}</>;
};

// USE SOCKET
export const useSocket = (id?: string, transactionId = 0) => {
    const {info} = useRedux().getProfile();

    const [chatId, setChatId] = useState(id);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);

    const dataUser = {
        _id: 2,
        name: info?.name,
    };

    const [image, setImage] = useState<any>({});

    const getListMessage = async () => {
        setMessages([]);
        const resonseMess = await getAllListMessage(Number(id));
        const messagesNew = resonseMess?.data?.map((item: any) => {
            return formateMessage(item);
        });
    };
};
