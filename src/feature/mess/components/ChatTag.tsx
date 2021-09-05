import {TypeChatTagResponse} from 'api/interface';
import Images from 'asset/img/images';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {MESS_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

interface ChatTagProps {
    item: TypeChatTagResponse;
    cancelStatusNewMessage(chatTagId: number): void;
}

const ChatTag = (props: ChatTagProps) => {
    const {item, cancelStatusNewMessage} = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile?.id;

    const goToChat = () => {
        cancelStatusNewMessage(item.id);
        navigate(MESS_ROUTE.chatDetail, {itemChatTag: item});
    };

    // render_view
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
        <StyleTouchable
            customStyle={[
                styles.container,
                {borderBottomColor: theme.borderColor},
            ]}
            onPress={goToChat}>
            {/* AVATAR */}
            <StyleImage
                source={{uri: renderPartnerAvatar()}}
                customStyle={[
                    styles.avatar,
                    {
                        borderColor: item.hasNewMessage
                            ? theme.highlightColor
                            : theme.borderColor,
                        borderWidth: item.hasNewMessage
                            ? moderateScale(2)
                            : moderateScale(1.5),
                    },
                ]}
                resizeMode="cover"
            />

            <View style={styles.contentPart}>
                {/* NAME CHAT TAG */}
                <View style={styles.nameBox}>
                    <StyleText
                        originValue={item.groupName}
                        customStyle={[
                            styles.nameText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {/* IS THIS SHH */}
                <View style={styles.statusBox}>
                    {item.isPrivate && (
                        <StyleIcon
                            source={Images.icons.shh}
                            size={30}
                            customStyle={[
                                styles.iconShh,
                                {tintColor: theme.borderColor},
                            ]}
                        />
                    )}
                </View>
            </View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '95%',
        marginVertical: '10@vs',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        paddingBottom: '7@vs',
        paddingHorizontal: '15@s',
        alignSelf: 'center',
    },
    avatar: {
        width: '37@vs',
        height: '37@vs',
        alignSelf: 'center',
        borderRadius: '25@vs',
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
    iconShh: {},
});

export default ChatTag;
