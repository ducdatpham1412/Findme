import {TypeCommentResponse} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import InputComment from 'components/common/InputComment';
import StyleKeyboardAwareView from 'components/StyleKeyboardAwareView';
import Redux from 'hook/useRedux';
import {socketAddComment, useSocketComment} from 'hook/useSocketIO';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import ItemComment from './ItemComment';

const ModalComment = () => {
    const bubbleFocusing = Redux.getBubbleFocusing();
    const displayComment = Redux.getDisplayComment();

    const theme = Redux.getTheme();
    const token = Redux.getToken();

    const inputRef = useRef<TextInput>(null);
    const translateY = useRef(new Animated.Value(Metrics.height)).current;

    const [textComment, setTextComment] = useState('');
    const [personReplied, setPersonReplied] = useState('');
    const [commentReplied, setCommentReplied] = useState(''); // if "", it not reply any comment

    const {list, loading, onRefresh} = useSocketComment();

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: displayComment ? 0 : Metrics.height,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [displayComment]);

    const onSendComment = async () => {
        socketAddComment({
            token: String(token),
            bubbleId: bubbleFocusing.id,
            content: textComment.trimEnd(),
            commentReplied,
        });
        setCommentReplied('');
        setTextComment('');
    };

    const onFocusingTypingComment = () => {
        inputRef.current?.focus();
    };

    const onPresReply = (commentId: string, _personReplied: string) => {
        setCommentReplied(commentId);
        setPersonReplied(_personReplied);
        onFocusingTypingComment();
    };

    const onDeleteReply = () => {
        setCommentReplied('');
        setPersonReplied('');
    };

    const onGoToProfile = (userId: number) => {
        navigate(ROOT_SCREEN.otherProfile, {
            id: userId,
        });
    };

    /**
     * Render view
     */
    const RenderHeader = () => {
        return (
            <View style={styles.headerTouch}>
                <StyleText
                    i18Text="discovery.numberComments"
                    i18Params={{
                        numberComments: bubbleFocusing.totalComments,
                    }}
                    customStyle={[
                        styles.textNumberComments,
                        {color: theme.textColor},
                    ]}
                />
                <StyleTouchable
                    customStyle={styles.iconTurnOffTouch}
                    onPress={() => {
                        onDeleteReply();
                        Redux.setDisplayComment(false);
                    }}>
                    <Feather
                        name="x"
                        style={[styles.iconTurnOff, {color: theme.textColor}]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    const RenderItemComment = useCallback((item: TypeCommentResponse) => {
        return (
            <ItemComment
                item={item}
                commentReplied=""
                onPressReply={onPresReply}
                onGoToProfile={onGoToProfile}
            />
        );
    }, []);

    const RenderListComments = useMemo(() => {
        return (
            <StyleList
                style={styles.listCommentBox}
                data={list}
                renderItem={({item}) => RenderItemComment(item)}
                keyExtractor={(_, index) => String(index)}
                contentContainerStyle={{paddingBottom: 100}}
                refreshing={loading}
                onRefresh={onRefresh}
            />
        );
    }, [list, loading]);

    return (
        <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
            <StyleKeyboardAwareView
                containerStyle={styles.body}
                innerStyle={{justifyContent: 'flex-end'}}>
                <View
                    style={[
                        styles.commentBox,
                        {
                            backgroundColor: theme.backgroundColor,
                            borderColor: theme.borderColor,
                        },
                    ]}>
                    {RenderHeader()}

                    {RenderListComments}

                    <InputComment
                        ref={inputRef}
                        text={textComment}
                        onChangeText={(text: string) => setTextComment(text)}
                        onSendComment={onSendComment}
                        commentIdReplied={commentReplied}
                        personNameReplied={personReplied}
                        onDeleteReply={onDeleteReply}
                    />
                </View>
            </StyleKeyboardAwareView>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    body: {
        flex: 1,
    },
    commentBox: {
        flex: 0.65,
        borderWidth: '1@ms',
        borderTopLeftRadius: '20@ms',
        borderTopRightRadius: '20@ms',
        borderBottomWidth: 0,
    },
    headerTouch: {
        width: '100%',
        paddingTop: '6@vs',
        paddingBottom: '10@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNumberComments: {
        fontSize: '13@ms',
    },
    iconTurnOffTouch: {
        position: 'absolute',
        right: '10@s',
    },
    iconTurnOff: {
        fontSize: '20@ms',
    },
    listCommentBox: {
        flex: 1,
    },
});

export default ModalComment;
