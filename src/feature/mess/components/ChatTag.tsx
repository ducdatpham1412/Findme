import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import {MESS_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface ChatTagProps {
    id: number;
    name: string;
    avatar: string;
    latestChat: string;
}

const ChatTag = (props: ChatTagProps) => {
    const theme = useRedux().getTheme();
    const {id, name, avatar, latestChat} = props;

    const goToChat = () => {
        navigate(MESS_ROUTE.chatDetail, {id, name, avatar});
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
                source={{uri: avatar}}
                customStyle={[styles.avatar, {borderColor: theme.borderColor}]}
                resizeMode="cover"
            />

            {/* NAME AND LATEST CHAT */}
            <View style={styles.contentPart}>
                <View style={styles.nameBox}>
                    <StyleText
                        originValue={name}
                        customStyle={[
                            styles.nameText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                <View style={styles.latestBox}>
                    <StyleText
                        originValue={latestChat}
                        customStyle={[
                            styles.latestChat,
                            {color: theme.borderColor},
                        ]}
                    />
                </View>
            </View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '60@vs',
        marginVertical: '10@vs',
        paddingVertical: '5@vs',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
    },
    avatar: {
        width: '45@vs',
        height: '45@vs',
        alignSelf: 'center',
        borderRadius: '25@vs',
        borderWidth: 1.5,
    },
    contentPart: {
        flex: 1,
        paddingHorizontal: '10@s',
    },
    nameBox: {
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    latestBox: {
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    nameText: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    latestChat: {
        fontSize: '15@ms',
    },
});

export default ChatTag;
