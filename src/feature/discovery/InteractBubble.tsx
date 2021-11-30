import {TypeBubblePalace, TypeChatTagRequest} from 'api/interface';
import {CHAT_TAG} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {
    StyleIcon,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {startChatTag, startChatTagEnjoy} from 'hook/useSocketIO';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    route: {
        params: {
            item: TypeBubblePalace;
            isBubble: boolean;
            havingOption?: boolean;
        };
    };
}

const InteractBubble = ({route}: Props) => {
    const {item, isBubble, havingOption} = route.params;

    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    const theme = Redux.getTheme();
    const {id} = Redux.getPassport().profile;

    const inputRef = useRef<any>();
    const [displayOption, setDisplayOption] = useState(false);
    const [message, setMessage] = useState('');

    const finalHavingOption = useMemo(() => {
        return havingOption && !isModeExp && item.creatorId !== id;
    }, []);

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
            content: message,
            listUser: [id, item.creatorId],
            color: item.color,
            senderId: id,
            idBubble: item.id,
        };
        if (isBubble) {
            newChatTag.nameBubble = item.name;
        }
        try {
            if (!isModeExp) {
                startChatTag({
                    token,
                    newChatTag,
                });
            } else {
                startChatTagEnjoy({
                    myId: id,
                    newChatTag,
                });
            }
        } catch (err) {
            appAlert(err);
        }
        goBack();
    };

    const onReportUser = useCallback(() => {
        navigate(ROOT_SCREEN.reportUser, {
            idUser: item.creatorId,
        });
    }, [item.creatorId]);

    /**
     * Render view
     */
    const RenderNameAndAvatar = useMemo(() => {
        return (
            <>
                <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={[
                        styles.avatar,
                        {borderColor: theme.highlightColor},
                    ]}
                />
                <StyleText
                    originValue={item.name}
                    customStyle={[styles.nameText, {color: theme.textColor}]}
                />
            </>
        );
    }, [item.creatorAvatar, item.name, theme]);

    const RenderOptionBox = useMemo(() => {
        if (finalHavingOption) {
            return (
                <>
                    {displayOption && (
                        <View
                            style={[
                                styles.optionBox,
                                {
                                    backgroundColor: theme.backgroundColor,
                                },
                            ]}>
                            <StyleTouchable onPress={onReportUser}>
                                <StyleText
                                    i18Text="discovery.interactBubble.report"
                                    customStyle={[
                                        styles.textReport,
                                        {color: theme.highlightColor},
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    )}

                    <StyleTouchable
                        customStyle={styles.touchIconMore}
                        onPress={() => {
                            setDisplayOption(!displayOption);
                        }}>
                        <Feather
                            name="more-vertical"
                            style={[
                                styles.iconMore,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                </>
            );
        }
        return null;
    }, [finalHavingOption, displayOption, item.creatorId]);

    const RenderIconAndDescription = useMemo(() => {
        return (
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
        );
    }, [item.icon, item.description]);

    const RenderIconSend = useMemo(() => {
        return (
            <Feather
                name="send"
                style={[styles.iconSend, {color: theme.borderColor}]}
            />
        );
    }, []);

    return (
        <View style={[styles.container]}>
            <StyleTouchable
                customStyle={styles.spaceView}
                onPress={onTouchBackground}
                activeOpacity={1}
            />

            <View
                style={[
                    styles.interactView,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                    },
                ]}>
                {/* Avatar, Name and Report */}
                <View
                    style={[
                        styles.avatarAndNameBox,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    {RenderNameAndAvatar}
                    {RenderOptionBox}
                </View>

                {/* Icon and Description */}
                {RenderIconAndDescription}

                {/* Input Message */}
                <View style={styles.inputAndSendView}>
                    <StyleInput
                        ref={inputRef}
                        value={message}
                        onChangeText={text => setMessage(text)}
                        containerStyle={[
                            styles.inputContainer,
                            {
                                borderColor: theme.highlightColor,
                            },
                        ]}
                        multiline
                        i18Placeholder="discovery.interactBubble.enterMessage"
                        placeholderTextColor={theme.holderColorLighter}
                        keyboardAppearance={Redux.getThemeKeyboard()}
                        hasErrorBox={false}
                        hasUnderLine={false}
                    />
                    <StyleTouchable onPress={onSendInteract}>
                        {RenderIconSend}
                    </StyleTouchable>
                </View>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    spaceView: {
        position: 'absolute',
        width: '100%',
        height: Metrics.height,
    },
    interactView: {
        width: '80%',
        borderRadius: '20@vs',
        paddingHorizontal: '10@s',
        paddingVertical: '20@vs',
        marginTop: '100@vs',
    },
    optionBox: {
        position: 'absolute',
        top: 0,
        right: '30@s',
        paddingHorizontal: '10@s',
        paddingVertical: '7@s',
        borderRadius: '4@s',
    },
    touchIconMore: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    textReport: {
        fontSize: '15@ms',
    },
    iconMore: {
        fontSize: '20@ms',
    },
    // Avatar and name
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
    // Icon and description
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
    // Input message
    inputAndSendView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: '5@s',
        paddingTop: '5@vs',
        paddingBottom: '10@vs',
        borderWidth: '0.25@ms',
        borderRadius: Platform.select({
            ios: '10@ms',
            android: '3@ms',
        }),
        fontSize: '14@ms',
    },
    iconSend: {
        fontSize: '20@ms',
        marginLeft: '20@s',
        marginRight: '10@s',
    },
});

export default InteractBubble;
