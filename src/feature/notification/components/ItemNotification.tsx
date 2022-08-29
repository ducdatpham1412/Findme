import {TypeNotificationResponse} from 'api/interface';
import Images from 'asset/img/images';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {chooseTextNotification, onGoToProfile} from 'utility/assistant';

interface Props {
    item: TypeNotificationResponse;
    onGoToDetailNotification(item: TypeNotificationResponse): void;
}

const ItemNotification = (props: Props) => {
    const {item, onGoToDetailNotification} = props;
    const theme = Redux.getTheme();
    const textColor = item.isRead ? theme.textColor : theme.textHightLight;

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={() => onGoToDetailNotification(item)}>
            <StyleTouchable
                customStyle={styles.avatarBox}
                onPress={() => onGoToProfile(item.creator)}>
                <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={styles.avatar}
                    defaultSource={Images.images.defaultAvatar}
                />
            </StyleTouchable>

            <View style={styles.textView}>
                <StyleText
                    originValue={item.creatorName}
                    customStyle={[
                        styles.textNotification,
                        {color: textColor, fontWeight: 'bold'},
                    ]}
                    numberOfLines={2}>
                    <StyleText
                        i18Text={chooseTextNotification(item.type)}
                        customStyle={[
                            styles.textNotification,
                            {color: textColor, fontWeight: 'normal'},
                        ]}
                        numberOfLines={2}
                    />
                </StyleText>
            </View>

            {item.image && (
                <View style={styles.imageView}>
                    <StyleImage
                        source={{uri: item.image}}
                        customStyle={styles.image}
                    />
                </View>
            )}
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginBottom: '20@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        marginRight: '10@s',
    },
    avatar: {
        width: '40@vs',
        height: '40@vs',
        borderRadius: '20@vs',
    },
    textView: {
        flex: 1,
    },
    textNotification: {
        fontSize: '14@ms',
    },
    imageView: {
        width: '60@s',
        alignItems: 'flex-end',
    },
    image: {
        width: '30@s',
        height: '35@s',
    },
});

export default ItemNotification;
