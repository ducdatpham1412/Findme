import {TypeChatTagResponse} from 'api/interface';
import {apiGetListChatTags} from 'api/module';
import StyleList from 'components/base/StyleList';
import {useSocketChatTagBubble} from 'hook/SocketProvider';
import Redux from 'hook/useRedux';
import Header from 'navigation/components/Header';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ChatTag from './components/ChatTag';

const MessScreen: React.FunctionComponent = () => {
    const {t} = useTranslation();
    const theme = Redux.getTheme();

    const {listChatTags} = useSocketChatTagBubble();
    const data: any = listChatTags;

    const getData = async () => {
        try {
            const res = await apiGetListChatTags();
            Redux.updateListChatTag(res.data);
        } catch (err) {
            appAlert(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const cancelStatusNewMessage = (chatTagId: number) => {
        const temp = listChatTags.map(item => {
            if (item.id === chatTagId) {
                return {
                    ...item,
                    hasNewMessage: false,
                };
            }
            return item;
        });
        Redux.updateListChatTag(temp);
    };

    // render_view
    const renderChatTag = (item: TypeChatTagResponse) => {
        return (
            <ChatTag
                key={item.id}
                item={item}
                cancelStatusNewMessage={cancelStatusNewMessage}
            />
        );
    };

    return (
        <View style={[styles.container, {borderColor: theme.borderColor}]}>
            {/* HEADER */}
            <Header
                headerLeft={null}
                headerTitle={t('mess.messScreen.headerTitle')}
            />

            {/* CHAT TAG */}
            <StyleList
                data={data}
                renderItem={({item}) => {
                    const _item: any = item;
                    return renderChatTag(_item);
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: '20@vs',
        borderBottomWidth: 0,
    },
    listTagBox: {
        paddingHorizontal: '10@s',
        backgroundColor: 'transparent',
    },
});

export default memo(MessScreen);
