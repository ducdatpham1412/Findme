import {
    TypeBubblePalace,
    TypeCommentResponse,
    TypeCreatePostResponse,
} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import InputComment from 'components/common/InputComment';
import StyleKeyboardAwareView from 'components/StyleKeyboardAwareView';
import ItemComment from 'feature/discovery/components/ItemComment';
import Redux from 'hook/useRedux';
import {socketAddComment, useSocketComment} from 'hook/useSocketIO';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    bubbleFocusing: TypeCreatePostResponse | undefined;
    setBubbleFocusing: Function;
}

const modalRef = React.createRef<Modalize>();

export const showModalCommentDetailBubble = () => {
    modalRef.current?.open();
};

const closeModal = () => {
    modalRef.current?.close();
};

const ModalCommentDetailBubble = (props: Props) => {
    const {bubbleFocusing, setBubbleFocusing} = props;
    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const {profile} = Redux.getPassport();

    const listCommentRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    const [textComment, setTextComment] = useState('');
    const [personReplied, setPersonReplied] = useState('');
    const [commentReplied, setCommentReplied] = useState('');

    const {list, loading, refreshing, onRefresh} = useSocketComment({
        bubbleFocusing,
        updateBubbleFocusing: value => {
            setBubbleFocusing((preValue: TypeBubblePalace) => ({
                ...preValue,
                ...value,
            }));
        },
        changeTotalComments: value => {
            setBubbleFocusing((preValue: TypeBubblePalace) => ({
                ...preValue,
                totalComments: preValue.totalComments + value,
            }));
        },
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
                postId: bubbleFocusing?.id || '',
                commentReplied: commentReplied || null,
                content: textComment,
                images: [],
                creatorName: profile.name,
                creatorAvatar: profile.avatar,
            },
        });
        setCommentReplied('');
        setTextComment('');
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

    const onGoToProfile = (userId: number) => {
        navigate(ROOT_SCREEN.otherProfile, {
            id: userId,
        });
    };

    /**
     * Render view
     */
    const Header = () => {
        return (
            <View style={styles.headerTouch}>
                <StyleText
                    i18Text="discovery.numberComments"
                    i18Params={{
                        numberComments: bubbleFocusing?.totalComments || '',
                    }}
                    customStyle={[
                        styles.textNumberComments,
                        {color: theme.textColor},
                    ]}
                />
                <StyleTouchable
                    customStyle={styles.iconTurnOffTouch}
                    onPress={closeModal}
                    hitSlop={15}>
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

    return (
        <Modalize
            ref={modalRef}
            withHandle={false}
            modalHeight={commentModalHeight}
            modalStyle={{
                backgroundColor: 'transparent',
            }}
            overlayStyle={{
                backgroundColor: theme.backgroundOpacity(),
            }}
            scrollViewProps={{
                keyboardShouldPersistTaps: 'handled',
                nestedScrollEnabled: true,
            }}>
            <StyleKeyboardAwareView
                containerStyle={[
                    styles.container,
                    {
                        backgroundColor: theme.backgroundColorSecond,
                    },
                ]}>
                {Header()}

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
                />
            </StyleKeyboardAwareView>
        </Modalize>
    );
};

const commentModalHeight = (Metrics.height * 2) / 2.7;
const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: commentModalHeight,
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
    },
    // header
    headerTouch: {
        width: '100%',
        marginTop: '10@vs',
        marginBottom: '10@vs',
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
        fontSize: '13@ms',
    },
    // list comment
    listCommentBox: {
        flex: 1,
    },
});

export default ModalCommentDetailBubble;
