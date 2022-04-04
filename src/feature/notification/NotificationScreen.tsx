import {TypeNotificationResponse} from 'api/interface';
import {apiReadNotification} from 'api/module';
import {TYPE_FOLLOW, TYPE_NOTIFICATION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import {
    useSocketNotification,
    useSocketNotificationEnjoy,
} from 'hook/useSocketIO';
import ROOT_SCREEN, {MAIN_SCREEN} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ItemNotification from './components/ItemComment';

const NotificationScreen = () => {
    const theme = Redux.getTheme();
    const {id, name} = Redux.getPassport().profile;
    const isModeExp = Redux.getModeExp();

    const {list, setList, onRefresh, onLoadMore, refreshing} = !isModeExp
        ? useSocketNotification()
        : useSocketNotificationEnjoy();

    useEffect(() => {
        let checkNumberNew = 0;
        list.forEach(item => {
            if (!item.hadRead) {
                checkNumberNew++;
            }
        });
        Redux.setNumberNewNotifications(checkNumberNew);
    }, [list]);

    const onGoToDetailNotification = async (item: TypeNotificationResponse) => {
        if (item.type === TYPE_NOTIFICATION.likePost) {
            if (item?.bubbleId) {
                navigate(ROOT_SCREEN.detailBubble, {
                    bubbleId: item.bubbleId,
                });
            }
        } else if (item.type === TYPE_NOTIFICATION.newChatTag) {
            if (item?.chatTagId) {
                Redux.setChatTagFromNotification(item.chatTagId);
            }
        } else if (item.type === TYPE_NOTIFICATION.follow) {
            navigate(ROOT_SCREEN.listFollows, {
                userId: id,
                name,
                type: TYPE_FOLLOW.follower,
                onGoBack: () => navigate(MAIN_SCREEN.notificationRoute),
            });
        } else if (item.type === TYPE_NOTIFICATION.comment) {
            if (item?.bubbleId) {
                navigate(ROOT_SCREEN.detailBubble, {
                    bubbleId: item.bubbleId,
                    displayComment: true,
                });
            }
        }

        if (!item.hadRead) {
            try {
                await apiReadNotification(item.id);
                setList((preValue: Array<TypeNotificationResponse>) => {
                    return preValue.map(__item => {
                        if (__item.id === item.id) {
                            return {
                                ...__item,
                                hadRead: true,
                            };
                        }
                        return __item;
                    });
                });
            } catch (err) {}
        }
    };

    const renderItem = (item: TypeNotificationResponse) => {
        return (
            <ItemNotification
                item={item}
                onGoToDetailNotification={onGoToDetailNotification}
            />
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View style={styles.titleView}>
                <StyleText
                    i18Text="notification.title"
                    customStyle={[styles.textTitle, {color: theme.borderColor}]}
                />
            </View>

            <StyleList
                data={list}
                renderItem={({item}) => renderItem(item)}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                keyExtractor={item => item.id}
                scrollEnabled
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
        paddingHorizontal: '15@s',
    },
    titleView: {
        paddingVertical: '10@vs',
    },
    textTitle: {
        fontSize: '25@ms',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: '100@vs',
    },
});

export default NotificationScreen;
