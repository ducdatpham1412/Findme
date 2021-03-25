import {StyleContainer} from 'components/base';
import Header from 'navigation/components/Header';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {getListChat} from 'asset/staticData';
import ChatTag from './components/ChatTag';

const MessScreen: React.FunctionComponent = () => {
    const {t} = useTranslation();
    const [listChat, setListChat] = useState<Array<any>>([]);

    const getData = async () => {
        const res = getListChat;
        setListChat(res);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <Header
                headerLeft={null}
                headerTitle={t('mess.messScreen.headerTitle')}
            />

            {/* CHAT TAG */}
            <StyleContainer
                scrollEnabled={true}
                containerStyle={styles.listTagBox}>
                {listChat.map(item => (
                    <ChatTag
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        avatar={item.avatar}
                        latestChat={item.latestChat}
                    />
                ))}
            </StyleContainer>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    listTagBox: {
        paddingHorizontal: '10@s',
        backgroundColor: 'transparent',
    },
});

export default MessScreen;
