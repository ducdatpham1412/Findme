import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {Animated, TextInput, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {chooseImageFromCamera, chooseImageFromLibrary} from 'utility/assistant';

interface UserInputProps {
    text: string;
    setText: any;
    images: Array<string>;
    setImages: any;
    onSendMessage(): void;
}

const UserInput = (props: UserInputProps) => {
    const {text, setText, onSendMessage, images, setImages} = props;
    const theme = Redux.getTheme();

    const aim = useRef(new Animated.Value(0.5)).current;
    const inputRef = useRef<TextInput>(null);

    aim.addListener(({value}) => setInputWidth(value * Metrics.width));

    const [inputWidth, setInputWidth] = useState(0.6 * Metrics.width);
    const [showImgTool, setShowImgTool] = useState(true);

    const stretchInput = (isFocusing: boolean, effectWhenHaveText = false) => {
        let temptFocus = effectWhenHaveText ? isFocusing : isFocusing || text;

        setShowImgTool(!temptFocus);

        Animated.timing(aim, {
            toValue: temptFocus ? 0.75 : 0.6,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            // if (!isFocusing) {
            //     inputRef.current?.blur();
            // } else {
            //     inputRef.current?.focus();
            // }
        });
    };

    const onChangeText = (_text: string) => {
        if (showImgTool) {
            stretchInput(true, true);
        }
        setText(_text);
    };

    // choose library
    const onChooseImageFromLibrary = () => {
        chooseImageFromLibrary(setImages, {
            crop: false,
            multiple: true,
            maxFiles: 2,
        });
    };

    // choose camera
    const onChooseImageFromCamera = () => {
        chooseImageFromCamera(setImages, {
            crop: false,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolView}>
                {/* CAMERA */}
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

                {/* PHOTO */}
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

            <Animated.View
                style={[
                    styles.inputView,
                    {width: inputWidth, borderColor: theme.borderColor},
                ]}>
                <TextInput
                    ref={inputRef}
                    value={text}
                    onChangeText={onChangeText}
                    style={[styles.input, {color: theme.textColor}]}
                    multiline
                    returnKeyType="default"
                    onFocus={() => stretchInput(true)}
                    onBlur={() => stretchInput(false)}
                    autoFocus={false}
                    keyboardAppearance={Redux.getThemeKeyboard()}
                    autoCapitalize="none"
                />
            </Animated.View>

            <View style={styles.emojiView}>
                <StyleTouchable
                    onPress={onSendMessage}
                    disable={!text && !images.length}
                    disableOpacity={1}>
                    <StyleImage
                        source={Images.icons.send}
                        customStyle={[
                            styles.sendIcon,
                            {tintColor: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingVertical: '10@vs',
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
        borderWidth: 1,
        borderRadius: '20@vs',
        paddingHorizontal: '10@s',
        paddingTop: '0@vs',
        paddingBottom: '6@vs',
    },
    emojiView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10@s',
    },
    input: {
        width: '100%',
        color: 'white',
        fontSize: '15@ms',
    },
    sendIcon: {
        width: '20@vs',
        height: '20@vs',
    },
});

export default UserInput;
