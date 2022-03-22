import {Metrics} from 'asset/metrics';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {socketTyping, socketUnTyping} from 'hook/useSocketIO';
import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {Animated, Keyboard, Platform, TextInput, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {chooseImageFromCamera, isIOS} from 'utility/assistant';

interface UserInputProps {
    text: string;
    setText: any;
    images: Array<string>;
    setImages: any;
    displayPickImg: boolean;
    setDisplayPickImg: any;
    onSendMessage(): void;
}

const durationStretch = isIOS ? 400 : 300;

const UserInput = (props: UserInputProps, inputRef: any) => {
    const {
        text,
        setText,
        onSendMessage,
        images,
        setImages,
        displayPickImg,
        setDisplayPickImg,
    } = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile.id;
    const chatTagFocusing = Redux.getChatTagFocusing();

    const aim = useRef(new Animated.Value(0.6)).current;
    const [inputWidth, setInputWidth] = useState(0.6 * Metrics.width);
    aim.addListener(({value}) => setInputWidth(value * Metrics.width));
    const [showImgTool, setShowImgTool] = useState(true);

    const stretchInput = useCallback(
        (isFocusing: boolean, effectWhenHaveText = false) => {
            let temptFocus = effectWhenHaveText
                ? isFocusing
                : isFocusing || text;

            setShowImgTool(!temptFocus);

            Animated.timing(aim, {
                toValue: temptFocus ? 0.75 : 0.6,
                duration: durationStretch,
                useNativeDriver: true,
            }).start();
        },
        [],
    );

    // const attachKeyboardListener = useCallback(() => {
    //     Keyboard.addListener('keyboardWillShow', () => stretchInput(true));
    //     Keyboard.addListener('keyboardWillHide', () => stretchInput(false));

    //     // Keyboard.addListener('keyboardDidShow', () => {
    //     //     if (!isIOS) {
    //     //         stretchInput(true);
    //     //     }
    //     // });
    //     // Keyboard.addListener('keyboardDidHide', () => {
    //     //     if (!isIOS) {
    //     //         stretchInput(false);
    //     //     }
    //     // });
    // }, []);

    // const detachKeyboardListener = useCallback(() => {
    //     Keyboard.removeListener('keyboardWillShow', () => stretchInput(true));
    //     Keyboard.removeListener('keyboardWillHide', () => stretchInput(false));

    //     // Keyboard.removeListener('keyboardDidShow', () => {
    //     //     if (!isIOS) {
    //     //         stretchInput(true);
    //     //     }
    //     // });
    //     // Keyboard.removeListener('keyboardDidHide', () => {
    //     //     if (!isIOS) {
    //     //         stretchInput(false);
    //     //     }
    //     // });
    // }, []);

    useEffect(() => {
        // if (isIOS) {
        //     attachKeyboardListener();
        //     return detachKeyboardListener;
        // }
    }, []);

    const onChangeText = (_text: string) => {
        if (showImgTool) {
            stretchInput(true, true);
        }
        setText(_text);
    };

    // choose library
    const onChooseImageFromLibrary = useCallback(async () => {
        if (displayPickImg) {
            setDisplayPickImg(false);
            inputRef.current?.focus();
        } else {
            Keyboard.dismiss();
            setDisplayPickImg(true);
        }
    }, [displayPickImg]);

    // choose camera
    const onChooseImageFromCamera = useCallback(() => {
        chooseImageFromCamera(
            (morePath: any) => {
                const allImages = images.concat(morePath);
                if (allImages.length > 2) {
                    const index = allImages.length - 1;
                    const finalImages = [
                        allImages[index - 1],
                        allImages[index],
                    ];
                    setImages(finalImages);
                } else {
                    setImages(allImages);
                }
            },
            {
                crop: false,
            },
            // () => inputRef.current?.focus(),
        );
    }, [images]);

    /**
     * Render views
     */
    const RenderImgTool = useMemo(() => {
        return (
            <View style={styles.toolView}>
                {showImgTool && (
                    <View style={styles.iconToolBox}>
                        <StyleTouchable onPress={onChooseImageFromCamera}>
                            <MaterialCommunityIcons
                                name="camera-outline"
                                style={[
                                    styles.iconTool,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                )}
                {showImgTool && (
                    <View style={styles.iconToolBox}>
                        <StyleTouchable onPress={onChooseImageFromLibrary}>
                            <MaterialCommunityIcons
                                name="image-outline"
                                style={[
                                    styles.iconTool,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                )}
                {!showImgTool && (
                    <View style={styles.iconToolBox}>
                        <StyleTouchable
                            onPress={() => stretchInput(false, true)}>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                style={[
                                    styles.iconTool,
                                    {
                                        color: theme.borderColor,
                                        fontSize: moderateScale(25),
                                    },
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                )}
            </View>
        );
    }, [showImgTool, images, displayPickImg]);

    const RenderIconSend = useMemo(() => {
        return (
            <Feather
                name="send"
                style={[styles.sendIcon, {color: theme.borderColor}]}
            />
        );
    }, []);

    return (
        <View style={styles.container}>
            {/* Tool view, choose camera or photo */}
            {RenderImgTool}

            {/* Enter text message */}
            <Animated.View
                style={[
                    styles.inputView,
                    {
                        width: inputWidth,
                        backgroundColor: theme.backgroundTextInput,
                    },
                ]}>
                <TextInput
                    ref={inputRef}
                    value={text}
                    onChangeText={onChangeText}
                    style={[styles.input, {color: theme.textColor}]}
                    multiline
                    returnKeyType="default"
                    onPressOut={() => {
                        setDisplayPickImg(false);
                    }}
                    keyboardAppearance={Redux.getThemeKeyboard()}
                    autoCapitalize="none"
                    accessible
                    onFocus={() =>
                        socketTyping({
                            chatTagId: chatTagFocusing,
                            userId: myId,
                        })
                    }
                    onBlur={() =>
                        socketUnTyping({
                            chatTagId: chatTagFocusing,
                            userId: myId,
                        })
                    }
                    placeholder="Hi"
                    placeholderTextColor={theme.holderColorLighter}
                />
            </Animated.View>

            {/* Button send message */}
            <StyleTouchable
                customStyle={styles.emojiView}
                onPress={onSendMessage}
                disable={!text && !images.length}
                disableOpacity={1}>
                {RenderIconSend}
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingVertical: '8@s',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    toolView: {
        flex: 1,
        paddingHorizontal: '10@s',
        flexDirection: 'row',
    },
    iconToolBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTool: {
        fontSize: '20@ms',
    },
    inputView: {
        borderRadius: '20@vs',
        paddingTop: '3@vs',
        paddingBottom: isIOS ? '7@vs' : '2@vs',
        paddingHorizontal: Platform.select({
            ios: '12@s',
            android: '8@s',
        }),
    },
    emojiView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '10@s',
        paddingRight: '15@s',
    },
    input: {
        width: '100%',
        color: 'white',
        fontSize: '16@ms',
        paddingVertical: 0,
    },
    sendIcon: {
        fontSize: '20@ms',
    },
});

export default memo(forwardRef(UserInput));
