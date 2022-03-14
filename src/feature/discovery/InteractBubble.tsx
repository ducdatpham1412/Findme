import {TypeBubblePalace, TypeChatTagRequest} from 'api/interface';
import FindmeStore from 'app-redux/store';
import {CHAT_TAG} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {startChatTag} from 'hook/useSocketIO';
import {goBack} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Platform, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {chooseColorGradient, choosePrivateAvatar} from 'utility/assistant';

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

    const token = Redux.getToken();
    const theme = Redux.getTheme();
    const {id} = Redux.getPassport().profile;

    const translateY = useRef(new Animated.Value(-300)).current;
    const aim = useRef(new Animated.Value(0)).current;
    const rotateY = aim.interpolate({
        inputRange: [0, 1],
        outputRange: ['80deg', '0deg'],
    });

    const inputRef = useRef<any>();
    const [message, setMessage] = useState('');

    const colorGradient = useMemo(() => {
        return chooseColorGradient({
            listGradients: FindmeStore.getState().logicSlice.resource.gradient,
            colorChoose: item.color,
        });
    }, []);

    const startMoving = useCallback(() => {
        Animated.timing(translateY, {
            toValue: 0,
            useNativeDriver: true,
            duration: 600,
        }).start(() => {
            Animated.spring(aim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 0.1,
            }).start();
        });
    }, []);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        startMoving();
    }, []);

    const onTouchBackground = useCallback(() => {
        if (inputRef.current.isFocused()) {
            inputRef.current.blur();
        } else {
            goBack();
        }
    }, []);

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
        startChatTag({
            token,
            newChatTag,
        });
        goBack();
    };

    /**
     * Render view
     */
    const RenderNameAndAvatar = useMemo(() => {
        return (
            <View
                style={[
                    styles.avatarAndNameBox,
                    {borderBottomColor: colorGradient[2]},
                ]}>
                <StyleImage
                    source={{uri: choosePrivateAvatar(item.gender)}}
                    customStyle={[
                        styles.avatar,
                        {borderColor: theme.highlightColor},
                    ]}
                />
                <StyleText
                    originValue={item.name}
                    customStyle={[
                        styles.nameText,
                        {color: Theme.common.textMe},
                    ]}
                />
            </View>
        );
    }, [item]);

    const RenderIconSend = useMemo(() => {
        return (
            <Feather
                name="send"
                style={[styles.iconSend, {color: Theme.common.white}]}
            />
        );
    }, []);

    return (
        <View style={[styles.container]}>
            <Text style={styles.spaceView} onPress={onTouchBackground} />

            <Animated.View
                style={[
                    styles.animatedView,
                    {transform: [{rotateY}, {translateY}]},
                ]}>
                <Text style={styles.spaceView} onPress={onTouchBackground} />
                <View
                    style={[
                        styles.cordBox,
                        {backgroundColor: colorGradient[2]},
                    ]}
                />

                <LinearGradient
                    style={[
                        styles.inputMessageBox,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                        },
                    ]}
                    colors={colorGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}>
                    {RenderNameAndAvatar}
                    {/* Input Message */}
                    <View style={styles.inputAndSendView}>
                        <StyleInput
                            ref={inputRef}
                            value={message}
                            onChangeText={text => setMessage(text)}
                            containerStyle={styles.inputContainer}
                            inputStyle={{color: Theme.common.textMe}}
                            multiline
                            i18Placeholder="Hello"
                            placeholderTextColor={
                                Theme.lightTheme.holderColorLighter
                            }
                            keyboardAppearance={Redux.getThemeKeyboard()}
                            hasErrorBox={false}
                            hasUnderLine={false}
                        />
                        <StyleTouchable
                            onPress={onSendInteract}
                            disable={!message}>
                            {RenderIconSend}
                        </StyleTouchable>
                    </View>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    spaceView: {
        position: 'absolute',
        width: '100%',
        height: Metrics.height,
    },
    animatedView: {
        width: '100%',
        alignItems: 'center',
    },
    // cord
    cordBox: {
        width: '3@s',
        height: '40%',
        backgroundColor: 'red',
    },
    // avatar and name
    avatarAndNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '10@s',
        paddingBottom: '10@vs',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
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
    // input
    inputMessageBox: {
        width: '80%',
        borderRadius: '50@vs',
        paddingHorizontal: '10@s',
        paddingVertical: '20@vs',
    },
    inputAndSendView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '10@vs',
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: '5@s',
        paddingTop: '5@vs',
        paddingBottom: '10@vs',
        fontSize: '14@ms',
    },
    iconSend: {
        fontSize: '20@ms',
        marginLeft: '20@s',
        marginRight: '10@s',
    },
});

export default InteractBubble;
