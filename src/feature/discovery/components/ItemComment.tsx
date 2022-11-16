import {TypeCommentResponse} from 'api/interface';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {View} from 'react-native';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters';
import {onGoToProfile} from 'utility/assistant';
import {formatFromNow} from 'utility/format';

interface Props {
    item: TypeCommentResponse;
    commentReplied: string;
    onPressReply?(idComment: string, personReplied: string): void;
}

const scale15 = scale(15);
const scale50 = scale(50);
const verticalScale5 = verticalScale(5);

const ItemComment = (props: Props) => {
    const {item, commentReplied = '', onPressReply} = props;
    const theme = Redux.getTheme();

    // const [numberLikes, setNumberLikes] = useState(item.numberLikes);
    // const [isLiked, setIsLiked] = useState(item.isLiked);

    // const color = isLiked ? theme.likeHeart : theme.unLikeHeart;

    const paddingLeft = !commentReplied ? scale15 : scale50;
    const marginBottom = !commentReplied ? verticalScale5 : 0;

    // const onLikeOrUnLike = async () => {
    //     const currentNumberLikes = numberLikes;
    //     const currentIsLiked = isLiked;

    //     try {
    //         setIsLiked(!currentIsLiked);
    //         setNumberLikes(numberLikes + (currentIsLiked ? -1 : 1));
    //     } catch (err) {
    //         appAlert(err);
    //         setIsLiked(currentIsLiked);
    //         setNumberLikes(currentNumberLikes);
    //     }
    // };

    /**
     * Render View
     */
    const RenderNameAndContent = () => {
        return (
            <View style={styles.nameAndContentTouch}>
                <StyleText customStyle={styles.nameText} numberOfLines={1}>
                    <StyleText
                        originValue={`${item.creatorName}`}
                        customStyle={[
                            styles.nameText,
                            {color: theme.borderColor},
                        ]}
                    />
                    <StyleText
                        originValue=" ・ "
                        customStyle={[
                            styles.nameText,
                            {color: theme.borderColor},
                        ]}
                    />
                    <StyleText
                        originValue={`${formatFromNow(item.created)}`}
                        customStyle={[
                            styles.nameText,
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleText>
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.contentText,
                        {color: theme.textHightLight},
                    ]}
                />
                {!commentReplied && (
                    <View style={styles.replyBox}>
                        <StyleTouchable
                            onPress={() =>
                                onPressReply?.(item.id, item.creatorName)
                            }
                            hitSlop={10}>
                            <StyleText
                                i18Text="common.reply"
                                customStyle={[
                                    styles.replyText,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                )}
            </View>
        );
    };

    const RenderLike = () => {
        return (
            <View>
                {/* <View style={styles.likeTouch}>
                    {isLiked ? (
                        <IconLiked
                            onPress={onLikeOrUnLike}
                            customStyle={[styles.iconLike, {color}]}
                        />
                    ) : (
                        <IconNotLiked
                            onPress={onLikeOrUnLike}
                            customStyle={[styles.iconLike, {color}]}
                        />
                    )}
                </View>
                <View style={styles.numberLikeTouch}>
                    {!!numberLikes && (
                        <StyleText
                            originValue={numberLikes}
                            customStyle={[styles.textNumberLikes, {color}]}
                        />
                    )}
                </View> */}
            </View>
        );
    };

    return (
        <View style={[styles.container, {marginBottom}]}>
            <View style={[styles.itemCommentBox, {paddingLeft}]}>
                <StyleTouchable onPress={() => onGoToProfile(item.creator)}>
                    <StyleImage
                        source={{uri: item.creatorAvatar}}
                        customStyle={styles.avatar}
                    />
                </StyleTouchable>
                {RenderNameAndContent()}
                {RenderLike()}
            </View>

            {item.listCommentsReply?.map((itemReply, index) => (
                <ItemComment
                    item={itemReply}
                    commentReplied={item.id}
                    key={index}
                />
            ))}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginTop: '10@vs',
    },
    itemCommentBox: {
        width: '100%',
        flexDirection: 'row',
        paddingRight: '15@s',
    },
    avatar: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '20@ms',
    },
    // name, content, reply
    nameAndContentTouch: {
        flex: 1,
        paddingLeft: '7@s',
    },
    nameText: {
        fontSize: '11.5@ms',
    },
    contentText: {
        fontSize: '13@ms',
        marginTop: '3@ms',
    },
    replyBox: {
        width: '100%',
        height: '20@ms',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    replyText: {
        fontSize: '10@ms',
    },
    // like
    likeTouch: {
        height: '33@ms',
        justifyContent: 'flex-end',
    },
    iconLike: {
        fontSize: '27@ms',
    },
    numberLikeTouch: {
        height: '20@ms',
        alignItems: 'center',
    },
    textNumberLikes: {
        fontSize: '13@ms',
    },
});

export default memo(ItemComment, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    if (preProps.commentReplied !== nextProps.commentReplied) {
        return false;
    }
    return true;
});
