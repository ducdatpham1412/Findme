import {TypeChatMessageResponse} from 'api/interface';
import {RELATIONSHIP} from 'asset/enum';
import {StyleImage, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import {View} from 'react-native';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters';

interface Props {
    itemMessage: TypeChatMessageResponse;
    isMyMessageBefore: boolean;
}

const ItemMessage = ({itemMessage, isMyMessageBefore}: Props) => {
    const theme = Redux.getTheme();

    const isMyMessage = itemMessage.relationship === RELATIONSHIP.self;
    const backgroundColor = isMyMessage
        ? theme.backgroundButtonColor
        : 'transparent';

    return (
        <View
            style={[
                styles.messageView,
                {
                    flexDirection: isMyMessage ? 'row-reverse' : 'row',
                    marginBottom: isMyMessageBefore ? 0 : verticalScale(30),
                },
            ]}>
            <View style={styles.avatarView}>
                {!isMyMessageBefore && (
                    <StyleImage
                        source={{uri: itemMessage.senderAvatar}}
                        customStyle={styles.avatarView}
                        resizeMode="cover"
                    />
                )}
            </View>

            <View style={styles.spaceView} />

            <View
                style={[
                    styles.messageBox,
                    {
                        backgroundColor,
                        paddingLeft: isMyMessage ? scale(17) : scale(10),
                        paddingRight: isMyMessage ? scale(10) : scale(17),
                        borderColor: theme.borderColor,
                        borderWidth: isMyMessage ? 0 : 0.5,
                    },
                ]}>
                <StyleText
                    originValue={itemMessage.message}
                    customStyle={[styles.messageText, {color: theme.textColor}]}
                />
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    messageView: {
        width: '100%',
        alignItems: 'center',
        marginTop: '4@vs',
    },
    messageBox: {
        paddingVertical: '7@vs',
        borderRadius: '20@vs',
        maxWidth: '70%',
        minWidth: '20%',
    },
    messageText: {
        fontSize: '15@ms',
    },
    avatarView: {
        width: '15@ms',
        height: '15@ms',
        borderRadius: '10@s',
    },
    spaceView: {
        width: '6@s',
    },
});

export default memo(ItemMessage);
