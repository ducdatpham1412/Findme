import {useIsFocused} from '@react-navigation/native';
import {TypeChatTagResponse} from 'api/interface';
import {apiGetDetailChatTag} from 'api/module';
import {StyleImage} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import {useSocketChatTagBubble} from 'hook/useSocketIO';
import Header from 'navigation/components/Header';
import {MESS_ROUTE, PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ChatTag from './components/ChatTag';

const RenderMessages = () => {
    const {setShowTabBar} = useTabBar();
    const isFocus = useIsFocused();

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
                setShowTabBar(false);
                navigate(MESS_ROUTE.chatDetail, {
                    itemChatTag: res.data,
                    setListChatTags,
                });
                Redux.setChatTagFromNotification(undefined);
            } catch (err) {
                appAlert(err);
            }
        }
    };

    useEffect(() => {
        if (isFocus) {
            setShowTabBar(true);
        }
    }, [isFocus]);

    useEffect(() => {
        goToChatDetailFromNotification();
    }, [chatTagFromNotification]);

    const onGoToChat = useCallback(async (chatTag: TypeChatTagResponse) => {
        try {
            if (!chatTag.userSeenMessage[String(id)].isLatest) {
                seenMessage(chatTag.id);
            }
            Redux.setChatTagFocusing(chatTag.id);
            navigate(MESS_ROUTE.chatDetail, {
                itemChatTag: chatTag,
                setListChatTags,
            });
            setShowTabBar(false);
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
    const {avatar} = Redux.getPassport().profile;
    const borderMessRoute = Redux.getBorderMessRoute();
    const theme = Redux.getTheme();

    const renderAvatar = useMemo(() => {
        return (
            <View style={[styles.avatarView, {borderColor: borderMessRoute}]}>
                <StyleImage
                    customStyle={styles.avatar}
                    source={{uri: avatar}}
                />
            </View>
        );
    }, [borderMessRoute, avatar]);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {/* Header */}
            <Header
                headerLeft={renderAvatar}
                headerLeftMission={() => navigate(PROFILE_ROUTE.myProfile)}
                headerTitle={'mess.messScreen.headerTitle'}
                headerTitleStyle={{
                    color: borderMessRoute,
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
        height: '50@vs',
        paddingHorizontal: '20@s',
    },
    listTagBox: {
        paddingHorizontal: '10@s',
        backgroundColor: 'transparent',
    },
    contentList: {
        paddingBottom: '50@vs',
    },
    avatarView: {
        width: '35@s',
        height: '35@s',
        borderWidth: '2@ms',
        borderRadius: '30@s',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '30@s',
    },
});

export default memo(MessScreen);
