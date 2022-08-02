import {TypeChatTagResponse} from 'api/interface';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {formDateMessage, isTimeBefore} from 'utility/format';

interface Props {
    item: TypeChatTagResponse;
    onGoToChat(chatTagId: TypeChatTagResponse): void;
}

const ChatTag = (props: Props) => {
    const {item, onGoToChat} = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile?.id;

    const hadNew = isTimeBefore(
        item.userData?.[String(myId)].modified,
        item.modified,
    );

    const RenderImage = () => {
        const chooseLink = () => {
            if (item.conversationImage) {
                return item.conversationImage;
            }
            const partnerInfo = item.listUser.find(
                userInfo => userInfo.id !== myId,
            );
            if (partnerInfo?.avatar) {
                return partnerInfo.avatar;
            }
            const myInfo = item.listUser.find(userInfo => userInfo.id === myId);
            return myInfo?.avatar || '';
        };

        return (
            <StyleImage
                source={{uri: chooseLink()}}
                customStyle={styles.avatar}
            />
        );
    };

    const RenderNameChatTag = () => {
        let name = item.conversationName;
        if (!name) {
            const partnerInfo = item.listUser.find(
                userInfo => userInfo.id !== myId,
            );
            name = partnerInfo?.name || '';
        }

        const color = hadNew ? theme.textHightLight : theme.textColor;
        const fontWeight = hadNew ? 'bold' : 'normal';

        return (
            <View style={styles.nameBox}>
                <StyleText
                    originValue={name}
                    customStyle={[
                        styles.nameText,
                        {
                            color,
                            fontWeight,
                        },
                    ]}
                    numberOfLines={1}
                />

                <View style={styles.latestMessageBox}>
                    {!!item.latestMessage && (
                        <StyleText
                            originValue={item.latestMessage}
                            customStyle={[
                                styles.latestMessageText,
                                {
                                    color: theme.borderColor,
                                },
                            ]}
                            numberOfLines={1}
                        />
                    )}
                    <StyleText
                        originValue={`・${formDateMessage(item.modified)}`}
                        customStyle={[
                            styles.textTime,
                            {
                                color: theme.borderColor,
                            },
                        ]}
                        numberOfLines={1}
                    />
                </View>
            </View>
        );
    };

    const RenderStatus = () => {
        if (hadNew) {
            return (
                <View
                    style={[
                        styles.hadNewDot,
                        {backgroundColor: theme.highlightColor},
                    ]}
                />
            );
        }

        if (item?.userTyping && item.userTyping.length) {
            return (
                <View style={styles.statusBox}>
                    <StyleText
                        i18Text="mess.typing"
                        customStyle={[
                            styles.textTyping,
                            {color: theme.holderColor},
                        ]}
                    />
                </View>
            );
        }
        return null;
    };

    return (
        <StyleTouchable
            customStyle={[
                styles.container,
                {
                    borderBottomColor: theme.borderColor,
                },
            ]}
            onPress={() => onGoToChat(item)}>
            {RenderImage()}

            <View style={styles.contentPart}>
                {RenderNameChatTag()}
                {RenderStatus()}
            </View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '95%',
        flexDirection: 'row',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingVertical: '17@s',
        paddingHorizontal: '10@s',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '47@s',
        height: '47@s',
        alignSelf: 'center',
        borderRadius: '25@s',
    },
    contentPart: {
        flex: 1,
        paddingHorizontal: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameBox: {
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        paddingRight: '20@s',
    },
    nameText: {
        fontSize: '17@ms',
    },
    latestMessageBox: {
        width: '100%',
        marginTop: '4@vs',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
    },
    latestMessageText: {
        fontSize: '12.5@ms',
        maxWidth: '70%',
    },
    textTime: {
        fontSize: '11@ms',
    },
    statusBox: {
        width: '40@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    status: {
        width: '7@s',
        height: '7@s',
        borderRadius: '8@s',
    },
    textTyping: {
        fontSize: '13@ms',
    },
    hadNewDot: {
        width: '8@ms',
        height: '8@ms',
        borderRadius: '4@ms',
    },
});

export default memo(ChatTag, (preProps: Props, nextProps: any) => {
    if (!isEqual(nextProps.item, preProps.item)) {
        return false;
    }
    return true;
});
