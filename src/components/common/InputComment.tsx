import {Metrics} from 'asset/metrics';
import {
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import React, {forwardRef, useMemo} from 'react';
import {Platform, View} from 'react-native';
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
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    borderTopColor: theme.borderColor,
                },
            ]}>
            {RenderReply()}

            {RenderAvatar}

            <StyleInput
                ref={inputRef}
                hasUnderLine={false}
                hasErrorBox={false}
                onPressOut={onPressOut}
                editable={editable}
                i18Placeholder="Comment..."
                placeholderTextColor={theme.holderColorLighter}
                containerStyle={styles.containerInput}
                inputStyle={styles.input}
                value={text}
                onChangeText={onChangeText}
                isEffectTabBar={false}
                multiline
            />

            <StyleTouchable
                customStyle={styles.emojiView}
                disable={!text}
                onPress={onSendComment}>
                {RenderIconSend}
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12@s',
        paddingTop: '7@ms',
        paddingBottom: verticalScale(7) + Metrics.safeBottomPadding,
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    replyView: {
        position: 'absolute',
        width: '100%',
        height: '20@vs',
        top: '-20@vs',
        left: '12@s',
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
    },
    avatar: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '15@ms',
    },
    containerInput: {
        flex: 1,
    },
    input: {
        fontSize: '15@ms',
    },
    emojiView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '10@s',
        paddingRight: '5@s',
    },
    sendIcon: {
        fontSize: '20@ms',
    },
});

export default forwardRef(InputComment);
