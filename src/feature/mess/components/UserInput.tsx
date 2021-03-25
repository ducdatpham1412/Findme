import Images from 'asset/img/images';
import {StyleImage, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {Animated, Dimensions, View, TextInput} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const {width} = Dimensions.get('screen');

interface UserInputProps {
    mess: string;
    setMess: any;
}

const UserInput = (props: UserInputProps) => {
    const {mess, setMess} = props;
    const theme = useRedux().getTheme();

    const aim = useRef(new Animated.Value(0.5)).current;
    const [inputWidth, setInputWidth] = useState(0.5 * width);
    const inputRef = useRef<TextInput>(null);

    aim.addListener(({value}) => setInputWidth(value * width));

    const stretchInput = (isFocusing: boolean) => {
        let temptFocus = isFocusing || !!mess;
        Animated.timing(aim, {
            toValue: temptFocus ? 0.7 : 0.5,
            duration: 600,
            useNativeDriver: true,
        }).start(() => {
            if (!isFocusing) inputRef.current?.blur();
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolBox}></View>

            <Animated.View
                style={[
                    styles.inputBox,
                    {width: inputWidth, borderColor: theme.borderColor},
                ]}>
                <TextInput
                    ref={inputRef}
                    value={mess}
                    style={[styles.input, {color: theme.textColor}]}
                    multiline
                    returnKeyType="next"
                    onChangeText={value => setMess(value)}
                    onFocus={() => stretchInput(true)}
                    onBlur={() => stretchInput(false)}
                />
            </Animated.View>

            <View style={styles.emojiBox}>
                <StyleTouchable>
                    <StyleImage
                        source={Images.sendIcon}
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
        position: 'absolute',
        bottom: 0,
        width: '100%',
        minHeight: '45@vs',
        paddingVertical: '10@vs',
        flexDirection: 'row',
    },
    toolBox: {
        flex: 1,
        flexDirection: 'row',
    },
    inputBox: {
        height: '100%',
        borderWidth: 1,
        borderRadius: '20@vs',
        paddingHorizontal: '10@s',
        paddingTop: '3@vs',
        paddingBottom: '6@vs',
    },
    emojiBox: {
        width: '40@vs',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        color: 'white',
        fontSize: '15@ms',
        textAlignVertical: 'center',
    },
    sendIcon: {
        width: '20@vs',
        height: '20@vs',
    },
});

export default UserInput;
