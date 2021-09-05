import {TypeBubblePalace, TypeChatTagRequest} from 'api/interface';
import {CHAT_TAG} from 'asset/enum';
import {
    StyleContainer,
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import {useSocketChatTagBubble} from 'hook/SocketProvider';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    route: {
        params: {
            item: TypeBubblePalace;
            isBubble: boolean;
        };
    };
}

const InteractBubble = ({route}: Props) => {
    const {item, isBubble} = route.params;
    const theme = Redux.getTheme();
    const {profile} = Redux.getPassport();
    const {t} = useTranslation();

    const inputRef = useRef<any>();
    const [message, setMessage] = useState('');

    const {sendChatTag} = useSocketChatTagBubble();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const onTouchBackground = () => {
        if (inputRef.current.isFocused()) {
            inputRef.current.blur();
        } else {
            goBack();
        }
    };

    const onSendInteract = () => {
        const newChatTag: TypeChatTagRequest = {
            type: isBubble ? CHAT_TAG.newFromBubble : CHAT_TAG.newFromProfile,
            message,
            listUser: [profile?.id || 0, item.creatorId],
            isPrivate: isBubble,
        };
        if (isBubble) {
            newChatTag.idBubble = item.id;
            newChatTag.nameBubble = item.name;
        }
        sendChatTag(newChatTag);
        goBack();
    };

    return (
        <StyleContainer
            containerStyle={styles.container}
            customStyle={styles.containerIn}
            keyboardShouldPersistTaps="always">
            <View
                style={styles.spaceView}
                onTouchEndCapture={onTouchBackground}
            />

            <View
                style={[
                    styles.interactView,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                    },
                ]}>
                {/* AVATAR AND NAME */}
                <View
                    style={[
                        styles.avatarAndNameBox,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    <StyleImage
                        source={{uri: item.creatorAvatar}}
                        customStyle={[
                            styles.avatar,
                            {borderColor: theme.highlightColor},
                        ]}
                        resizeMode="cover"
                    />
                    <StyleText
                        originValue={item.name}
                        customStyle={[
                            styles.nameText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {/* ICON AND DESCRIPTION */}
                <View style={styles.iconAndDesView}>
                    <View style={styles.iconBox}>
                        <StyleIcon source={{uri: item.icon}} size={20} />
                    </View>
                    <View style={styles.descriptionBox}>
                        <StyleText
                            originValue={item.description}
                            customStyle={[
                                styles.descriptionText,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                </View>

                {/* INTERACT MESSAGES */}
                <View style={styles.inputAndSendView}>
                    <TextInput
                        ref={inputRef}
                        value={message}
                        onChangeText={text => setMessage(text)}
                        style={[
                            styles.inputContainer,
                            {
                                borderColor: theme.highlightColor,
                                color: theme.textColor,
                            },
                        ]}
                        multiline
                        placeholder={t('discovery.interactBubble.enterMessage')}
                        placeholderTextColor={theme.borderColor}
                    />
                    <StyleTouchable onPress={onSendInteract}>
                        <Feather
                            name="send"
                            style={[
                                styles.iconSend,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    containerIn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    spaceView: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    interactView: {
        width: '80%',
        borderRadius: '20@vs',
        paddingHorizontal: '10@s',
        paddingVertical: '20@vs',
        // top: '150@vs',
    },
    // AVATAR AND NAME
    avatarAndNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        paddingBottom: '10@s',
    },
    avatar: {
        width: '35@s',
        height: '35@s',
        borderRadius: '30@s',
        borderWidth: 2,
    },
    nameText: {
        fontSize: '17@ms',
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    // ICON AND DESCRIPTION
    iconAndDesView: {
        width: '100%',
        paddingVertical: '15@vs',
        flexDirection: 'row',
    },
    iconBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionBox: {
        flex: 4,
        justifyContent: 'center',
    },
    descriptionText: {
        fontSize: '15@ms',
    },
    // INPUT MESSAGE
    inputAndSendView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: '10@s',
        minHeight: '40@vs',
        borderWidth: 0.25,
        borderRadius: '8@s',
        fontSize: '17@ms',
    },
    iconSend: {
        fontSize: '20@ms',
        marginLeft: '20@s',
        marginRight: '10@s',
    },
});

export default InteractBubble;
