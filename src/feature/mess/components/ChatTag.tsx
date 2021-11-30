import {TypeChatTagResponse} from 'api/interface';
import Images from 'asset/img/images';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo, useMemo} from 'react';
import {Platform, View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';

interface Props {
    item: TypeChatTagResponse;
    onGoToChat(chatTagId: TypeChatTagResponse): void;
}

const ChatTag = (props: Props) => {
    const {item, onGoToChat} = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile?.id;

    const isRequest = !!item?.isRequestingPublic;
    const haveSeenLatestMessage = item.userSeenMessage[String(myId)]?.isLatest;

    const RenderPartnerAvatar = useMemo(() => {
        const renderPartnerAvatar = () => {
            let temp = item.listUser[0].avatar;
            for (let i = 0; i < item.listUser.length; i++) {
                if (item.listUser[i].id !== myId) {
                    temp = item.listUser[i].avatar;
                    break;
                }
            }
            return temp;
        };

        return (
            <StyleImage
                source={{uri: renderPartnerAvatar()}}
                customStyle={[
                    styles.avatar,
                    {
                        borderColor: theme.highlightColor,
                        borderWidth: haveSeenLatestMessage ? 0 : scale(3.5),
                    },
                ]}
            />
        );
    }, [item.listUser, haveSeenLatestMessage, theme]);

    const RenderNameChatTag = useMemo(() => {
        let color = theme.textColor;
        if (item.isRequestingPublic || !haveSeenLatestMessage) {
            color = theme.highlightColor;
        }
        return (
            <View style={styles.nameBox}>
                <StyleText
                    originValue={item.groupName}
                    customStyle={[
                        styles.nameText,
                        {
                            color,
                            fontWeight: haveSeenLatestMessage
                                ? 'normal'
                                : 'bold',
                        },
                    ]}
                    numberOfLines={1}
                />
            </View>
        );
    }, [item.groupName, haveSeenLatestMessage, theme]);

    const RenderStatus = useMemo(() => {
        if (item.userTyping && item.userTyping.length) {
            return (
                <StyleText
                    i18Text="mess.typing"
                    customStyle={[
                        styles.textTyping,
                        {color: theme.holderColor},
                    ]}
                />
            );
        }

        if (item.isPrivate) {
            return (
                <StyleIcon
                    source={Images.icons.shh}
                    size={30}
                    customStyle={{
                        tintColor: isRequest
                            ? theme.highlightColor
                            : theme.borderColor,
                    }}
                />
            );
        }
        return null;
    }, [item.isPrivate, isRequest, item.userTyping, theme]);

    return (
        <StyleTouchable
            customStyle={[
                styles.container,
                {
                    borderBottomColor: theme.borderColor,
                },
            ]}
            onPress={() => onGoToChat(item)}>
            {RenderPartnerAvatar}

            <View style={styles.contentPart}>
                {RenderNameChatTag}
                <View style={styles.statusBox}>{RenderStatus}</View>
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
});

export default memo(ChatTag, (preProps: Props, nextProps: Props) => {
    if (preProps.item !== nextProps.item) {
        return false;
    }
    return true;
});
