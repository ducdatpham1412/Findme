import {TypeBubblePalace, TypeCommentResponse} from 'api/interface';
import {Metrics} from 'asset/metrics';
import ItemComment from 'feature/discovery/components/ItemComment';
import Redux from 'hook/useRedux';
import {socketAddComment, useSocketComment} from 'hook/useSocketIO';
import React, {useCallback, useRef, useState} from 'react';
import {
    FlatList,
    Platform,
    StyleProp,
    TextInput,
    ViewStyle,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import StyleList from './base/StyleList';
import InputComment from './common/InputComment';
import StyleKeyboardAwareView from './StyleKeyboardAwareView';

interface Props {
    bubbleFocusing: TypeBubblePalace;
    setTotalComments(value: number): void;
    increaseTotalComments(value: number): void;
    inputCommentContainerStyle?: StyleProp<ViewStyle>;
    extraHeight?: number;
}

const ListComments = (props: Props) => {
    const {
        bubbleFocusing,
        setTotalComments,
        increaseTotalComments,
        inputCommentContainerStyle,
        extraHeight = 7,
    } = props;
    const listCommentRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    const {profile} = Redux.getPassport();
    const token = Redux.getToken();
    const theme = Redux.getTheme();

    const [textComment, setTextComment] = useState('');
    const [personReplied, setPersonReplied] = useState('');
    const [commentReplied, setCommentReplied] = useState('');

    const {list, loading, refreshing, onRefresh} = useSocketComment({
        bubbleFocusingId: bubbleFocusing.id,
        setTotalComments,
        increaseTotalComments,
        scrollToIndex: (value: number) => {
            listCommentRef.current?.scrollToIndex({
                index: value,
                animated: true,
            });
        },
        scrollToEnd: () => {
            listCommentRef.current?.scrollToEnd();
        },
        myId: profile.id,
        clearText: () => {
            setCommentReplied('');
            inputRef.current?.clear();
        },
    });

    const onSendComment = async () => {
        socketAddComment({
            token: String(token),
            comment: {
                postId: bubbleFocusing.id,
                commentReplied: commentReplied || null,
                content: textComment,
                images: [],
                creatorName: profile.name,
                creatorAvatar: profile.avatar,
            },
        });
    };

    const onPresReply = (commentId: string, _personReplied: string) => {
        setCommentReplied(commentId);
        setPersonReplied(_personReplied);
        inputRef.current?.focus();
    };

    const onDeleteReply = () => {
        setCommentReplied('');
        setPersonReplied('');
    };

    const RenderItemComment = useCallback((item: TypeCommentResponse) => {
        return (
            <ItemComment
                item={item}
                commentReplied=""
                onPressReply={onPresReply}
            />
        );
    }, []);

    return (
        <StyleKeyboardAwareView
            containerStyle={[
                styles.container,
                {borderRightColor: theme.holderColor},
            ]}
            extraHeight={extraHeight}>
            {!loading && (
                <StyleList
                    ref={listCommentRef}
                    style={styles.listCommentBox}
                    data={list}
                    renderItem={({item}) => RenderItemComment(item)}
                    keyExtractor={(_, index) => String(index)}
                    contentContainerStyle={{paddingBottom: 100}}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}

            <InputComment
                ref={inputRef}
                text={textComment}
                onChangeText={(text: string) => setTextComment(text)}
                onSendComment={onSendComment}
                commentIdReplied={commentReplied}
                personNameReplied={personReplied}
                onDeleteReply={onDeleteReply}
                containerStyle={inputCommentContainerStyle}
            />
        </StyleKeyboardAwareView>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width,
        height: '100%',
        borderRightWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    listCommentBox: {
        flex: 1,
    },
});

export default ListComments;
