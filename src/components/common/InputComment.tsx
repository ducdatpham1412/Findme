import {Metrics} from 'asset/metrics';
import {
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {forwardRef, useMemo} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    // for press to show typing comment
    editable?: boolean;
    onPressOut?(): void;
    // for input comment
    text?: string;
    onChangeText?(text: string): any;
    onSendComment?(): void;
    commentIdReplied?: string;
    personNameReplied?: string;
    onDeleteReply?(): void;
    onFocus?(): void;
    onBlur?(): void;
    containerStyle?: StyleProp<ViewStyle>;
}

const InputComment = (props: Props, inputRef: any) => {
    const {
        editable = true,
        onPressOut,
        text = '',
        onChangeText,
        onSendComment,
        commentIdReplied,
        personNameReplied = '',
        onDeleteReply,
        onFocus,
        onBlur,
        containerStyle,
    } = props;

    const theme = Redux.getTheme();
    const {avatar} = Redux.getPassport().profile;

    const RenderAvatar = useMemo(() => {
        return (
            <StyleImage source={{uri: avatar}} customStyle={styles.avatar} />
        );
    }, []);

    const RenderIconSend = useMemo(() => {
        return (
            <Feather
                name="send"
                style={[styles.sendIcon, {color: theme.borderColor}]}
            />
        );
    }, []);

    const RenderReply = () => {
        if (!commentIdReplied) {
            return null;
        }
        return (
            <View style={styles.replyView}>
                <View
                    style={[
                        styles.spaceBackground,
                        {backgroundColor: theme.backgroundColor},
                    ]}
                />
                <StyleText
                    i18Text="common.reply"
                    customStyle={[
                        styles.textReply,
                        {color: theme.borderColor},
                    ]}>
                    <StyleText
                        originValue={` @${personNameReplied}`}
                        customStyle={[
                            styles.textReply,
                            {color: theme.borderColor, fontWeight: 'bold'},
                        ]}
                    />
                </StyleText>

                <Feather
                    name="x"
                    style={[
                        styles.textReply,
                        {
                            color: theme.borderColor,
                            fontWeight: 'bold',
                            marginLeft: 20,
                        },
                    ]}
                    onPress={onDeleteReply}
                />
            </View>
        );
    };

    return (
        <>
            {RenderReply()}
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.backgroundColor,
                        shadowColor: theme.textColor,
                    },
                    containerStyle,
                ]}>
                {RenderAvatar}

                <StyleInput
                    ref={inputRef}
                    hasUnderLine={false}
                    hasErrorBox={false}
                    onPressOut={onPressOut}
                    editable={editable}
                    i18Placeholder="Comment..."
                    placeholderTextColor={theme.holderColorLighter}
                    containerStyle={[
                        styles.containerInput,
                        {backgroundColor: theme.backgroundColorSecond},
                    ]}
                    inputStyle={[styles.input, {color: theme.textColor}]}
                    onChangeText={onChangeText}
                    isEffectTabBar={false}
                    multiline
                    onFocus={onFocus}
                    onBlur={onBlur}
                />

                <StyleTouchable
                    customStyle={styles.emojiView}
                    disable={!text}
                    onPress={onSendComment}
                    hitSlop={10}>
                    {RenderIconSend}
                </StyleTouchable>
            </View>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        maxHeight: '120@vs',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12@s',
        paddingTop: '10@ms',
        paddingBottom: verticalScale(7) + Metrics.safeBottomPadding,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowRadius: 20,
    },
    replyView: {
        width: '100%',
        height: '20@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    textReply: {
        fontSize: '10@ms',
        marginLeft: '20@s',
    },
    avatar: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '15@ms',
        marginRight: '5@s',
    },
    containerInput: {
        flex: 1,
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    input: {
        fontSize: '15@ms',
    },
    emojiView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '5@s',
    },
    sendIcon: {
        fontSize: '20@ms',
    },
});

export default forwardRef(InputComment);
