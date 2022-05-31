import {TypeChatTagResponse} from 'api/interface';
import {apiGetDetailChatTag} from 'api/module';
import {CHAT_TAG} from 'asset/enum';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import {useSocketChatTagBubble} from 'hook/useSocketIO';
import Header from 'navigation/components/Header';
import {MESS_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {memo, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import ChatTag from './components/ChatTag';

const RenderMessages = () => {
    const chatTagFromNotification = Redux.getChatTagFromNotification();
    const {id} = Redux.getPassport().profile;

    const {
        listChatTags,
        seenMessage,
        onRefresh,
        refreshing,
        onLoadMore,
        setListChatTags,
    } = useSocketChatTagBubble();

    const goToChatDetailFromNotification = async () => {
        if (chatTagFromNotification) {
            try {
                Redux.setChatTagFocusing(chatTagFromNotification);
                const res = await apiGetDetailChatTag(chatTagFromNotification);
                seenMessage(chatTagFromNotification);

                if (res.data.type === CHAT_TAG.group) {
                    navigate(MESS_ROUTE.chatDetailGroup, {
                        itemChatTag: res.data,
                        setListChatTags,
                    });
                } else {
                    navigate(MESS_ROUTE.chatDetail, {
                        itemChatTag: res.data,
                        setListChatTags,
                    });
                }
                Redux.setChatTagFromNotification(undefined);
                setListChatTags((preValue: Array<TypeChatTagResponse>) => {
                    const check = preValue.find(
                        item => item.id === chatTagFromNotification,
                    );
                    if (check) {
                        return preValue;
                    }
                    return [res.data].concat(preValue);
                });
            } catch (err) {
                appAlert(err);
            }
        }
    };

    useEffect(() => {
        goToChatDetailFromNotification();
    }, [chatTagFromNotification]);

    const onGoToChat = useCallback(async (chatTag: TypeChatTagResponse) => {
        try {
            if (
                !chatTag.userSeenMessage[String(id)].isLatest &&
                !chatTag.isBlock &&
                !chatTag.isStop
            ) {
                seenMessage(chatTag.id);
            }
            Redux.setChatTagFocusing(chatTag.id);
            if (chatTag.type === CHAT_TAG.group) {
                navigate(MESS_ROUTE.chatDetailGroup, {
                    itemChatTag: chatTag,
                    setListChatTags,
                });
            } else {
                navigate(MESS_ROUTE.chatDetail, {
                    itemChatTag: chatTag,
                    setListChatTags,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    }, []);

    /**
     * Render view
     */

    const renderChatTag = (item: TypeChatTagResponse) => {
        return <ChatTag key={item?.id} item={item} onGoToChat={onGoToChat} />;
    };

    return (
        <StyleList
            data={listChatTags}
            renderItem={({item}) => {
                return renderChatTag(item);
            }}
            contentContainerStyle={styles.contentList}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={onLoadMore}
        />
    );
};

/**
 * Boss here
 */
const MessScreen = () => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    const borderMessRoute = Redux.getBorderMessRoute();
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {/* Header */}
            <Header
                headerLeftMission={() => navigate(PROFILE_ROUTE.myProfile)}
                headerTitle={'mess.messScreen.headerTitle'}
                headerTitleStyle={{
                    color: borderMessRoute,
                    left: scale(30),
                }}
                containerStyle={styles.headerView}
            />

            {/* List chat tags */}
            {!isModeExp && token && <RenderMessages />}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerView: {
        height: '50@ms',
        paddingHorizontal: '20@s',
    },
    contentList: {
        paddingBottom: '50@vs',
    },
});

export default memo(MessScreen);
