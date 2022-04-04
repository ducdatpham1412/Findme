import {TypeNotificationResponse} from 'api/interface';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

interface Props {
    item: TypeNotificationResponse;
    onGoToDetailNotification(item: TypeNotificationResponse): void;
}

const ItemNotification = (props: Props) => {
    const {item, onGoToDetailNotification} = props;

    const theme = Redux.getTheme();

    const borderColor = item.hadRead ? theme.borderColor : theme.highlightColor;
    const textColor = item.hadRead ? theme.textColor : theme.highlightColor;
    const fontWeight = item.hadRead ? 'normal' : 'bold';

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={() => onGoToDetailNotification(item)}>
            {item.image ? (
                <StyleImage
                    source={{uri: item.image}}
                    customStyle={styles.image}
                />
            ) : (
                <View
                    style={[
                        styles.image,
                        {
                            borderColor,
                            borderWidth: item.image ? 0 : moderateScale(1),
                        },
                    ]}
                />
            )}

            <View style={styles.textView}>
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.textNotification,
                        {color: textColor, fontWeight},
                    ]}
                />
            </View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '60@vs',
        marginBottom: '10@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: '50@vs',
        height: '50@vs',
        borderRadius: '30@vs',
        alignItems: 'center',
        marginRight: '15@s',
    },
    textView: {
        flex: 1,
        flexWrap: 'nowrap',
    },
    textNotification: {
        fontSize: '15@ms',
    },
});

export default ItemNotification;
