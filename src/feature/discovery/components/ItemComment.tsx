import {TypeCommentResponse} from 'api/interface';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo} from 'react';
import {View} from 'react-native';
import {
    moderateScale,
    scale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import {formatFromNow} from 'utility/format';
import isEqual from 'react-fast-compare';

interface Props {
    item: TypeCommentResponse;
    commentReplied: string;
    onPressReply?(idComment: string, personReplied: string): void;
    onGoToProfile(userId: number): void;
}

const ItemComment = (props: Props) => {
    const {item, commentReplied = '', onPressReply, onGoToProfile} = props;

    const theme = Redux.getTheme();

    // const [numberLikes, setNumberLikes] = useState(item.numberLikes);
    // const [isLiked, setIsLiked] = useState(item.isLiked);

    // const color = isLiked ? theme.likeHeart : theme.unLikeHeart;

    const paddingLeft = !commentReplied
        ? scale(15)
        : scale(25) + moderateScale(40);
    const marginBottom = !commentReplied ? verticalScale(20) : verticalScale(0);

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

    const RenderAvatar = () => {
        return (
            <StyleTouchable
                onPress={() => onGoToProfile(item.creatorId)}
                disable={!item.creatorId}
                disableOpacity={1}>
                <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={styles.avatar}
                />
            </StyleTouchable>
        );
    };

    const RenderNameAndContent = () => {
        return (
            <View style={styles.nameAndContentTouch}>
                <StyleText
                    originValue={item.creatorName}
                    customStyle={[styles.nameText, {color: theme.borderColor}]}
                />
                <StyleText
                    originValue={item.content}
                    customStyle={[
                        styles.contentText,
                        {color: theme.textHightLight},
                    ]}
                />
                <View style={styles.timeReplyBox}>
                    {!commentReplied && (
                        <StyleTouchable
                            onPress={() =>
                                onPressReply?.(item.id, item.creatorName)
                            }>
                            <StyleText
                                i18Text="common.reply"
                                customStyle={[
                                    styles.replyText,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}

                    <StyleText
                        originValue={formatFromNow(item.createdTime)}
                        customStyle={[
                            styles.timeText,
                            {color: theme.borderColor},
                        ]}
                    />
                </View>
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
        <View style={{marginBottom, marginTop: verticalScale(10)}}>
            <View style={[styles.itemCommentBox, {paddingLeft}]}>
                {RenderAvatar()}
                {RenderNameAndContent()}
                {RenderLike()}
            </View>

            {item.listCommentsReply?.map((itemReply, index) => (
                <ItemComment
                    item={itemReply}
                    commentReplied={item.id}
                    key={index}
                    onGoToProfile={() => onGoToProfile(itemReply.creatorId)}
                />
            ))}
        </View>
    );
};

const styles = ScaledSheet.create({
    itemCommentBox: {
        width: '100%',
        flexDirection: 'row',
        paddingRight: '15@s',
    },
    avatar: {
        width: '40@ms',
        height: '40@ms',
        borderRadius: '20@ms',
    },
    // name, content, reply
    nameAndContentTouch: {
        flex: 1,
        paddingHorizontal: '10@s',
    },
    nameText: {
        fontSize: '13@ms',
        fontWeight: 'bold',
    },
    contentText: {
        fontSize: '14@ms',
        marginTop: '5@ms',
    },
    timeReplyBox: {
        width: '100%',
        height: '20@ms',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: '10@s',
    },
    replyText: {
        fontSize: '12@ms',
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: '12@ms',
        marginLeft: '20@s',
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
