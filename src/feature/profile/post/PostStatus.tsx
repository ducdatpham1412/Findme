import {TypeCreatePostResponse} from 'api/interface';
import {RELATIONSHIP} from 'asset/enum';
import AutoHeightImage from 'components/AutoHeightImage';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Redux from 'hook/useRedux';
import React, {memo, useRef} from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {chooseIconHobby, modalizeOptionPost} from 'utility/assistant';
import isEqual from 'react-fast-compare';

interface Props {
    itemPost: TypeCreatePostResponse;
    deleteAPostInList?(idPost: string): void;
    onGoToDetailPost(bubble: string): void;
}

const PostStatus = (props: Props) => {
    const {itemPost, deleteAPostInList, onGoToDetailPost} = props;

    const theme = Redux.getTheme();
    const optionsRef = useRef<any>(null);
    const isMyPost = itemPost.relationship === RELATIONSHIP.self;

    const onShowOptionPost = () => {
        optionsRef.current.show();
    };

    /**
     * Render view
     */
    const RenderBackground = () => {
        return (
            <View
                style={[
                    styles.spaceContainer,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    };

    const RenderAvatarNameOption = () => {
        return (
            <View style={styles.creatorView}>
                <View style={styles.avatarNameBox}>
                    <StyleImage
                        source={{uri: chooseIconHobby(itemPost.color)}}
                        customStyle={styles.avatar}
                    />
                    <StyleText
                        originValue={itemPost.name}
                        customStyle={[
                            styles.textName,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {isMyPost && (
                    <StyleTouchable onPress={onShowOptionPost} hitSlop={10}>
                        <AntDesign
                            name="infocirlceo"
                            style={[
                                styles.iconMore,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const RenderCaption = () => {
        const fontSize = itemPost.images[0]
            ? moderateScale(10)
            : moderateScale(15);

        return (
            <View style={styles.captionView}>
                {!!itemPost.content && (
                    <StyleText
                        originValue={itemPost.content}
                        customStyle={[
                            styles.textContent,
                            {color: theme.textColor, fontSize},
                        ]}
                        numberOfLines={1}
                    />
                )}
            </View>
        );
    };

    const RenderImage = () => {
        if (!itemPost.images[0]) {
            return null;
        }
        return (
            <View
                style={styles.imageView}
                // onDoubleClick={onSeeDetailImage}
            >
                <AutoHeightImage
                    uri={itemPost.images[0]}
                    customStyle={styles.image}
                />
            </View>
        );
    };

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={() => onGoToDetailPost(itemPost.id)}>
            {RenderBackground()}
            {RenderAvatarNameOption()}

            {RenderImage()}
            {RenderCaption()}

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={modalizeOptionPost({
                    itemPostFromEdit: itemPost,
                    deleteAPostInList: deleteAPostInList,
                })}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '99%',
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    spaceContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '10@s',
        opacity: 0.8,
    },
    // avatar and name
    creatorView: {
        width: '100%',
        paddingHorizontal: '15@s',
        flexDirection: 'row',
        marginVertical: '5@vs',
        alignItems: 'center',
    },
    avatarNameBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '15@s',
    },
    avatar: {
        width: '15@s',
        height: '15@s',
        borderRadius: '20@s',
        marginRight: '10@s',
    },
    textName: {
        fontSize: '12@ms',
        fontWeight: 'bold',
    },
    iconMore: {
        fontSize: '14@ms',
    },
    // caption
    captionView: {
        width: '100%',
        paddingHorizontal: '8@s',
        paddingVertical: '5@vs',
        overflow: 'hidden',
    },
    textContent: {
        fontSize: '10@ms',
    },
    // image
    imageView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '5@s',
    },
    image: {
        width: '100%',
        borderRadius: '10@s',
    },
    // heart icon
    interactView: {
        width: '100%',
        paddingBottom: '10@vs',
        paddingHorizontal: '5@s',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    heartIcon: {
        marginRight: '20@s',
    },
    likeBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    textNumberLike: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    commentBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconComment: {
        fontSize: '40@ms',
        marginRight: '15@s',
    },
    textLikeComment: {
        fontSize: '20@ms',
    },
    // icon hobby
    iconHobby: {
        width: '40@ms',
        height: '40@ms',
    },
});

export default memo(PostStatus, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.itemPost, nextProps.itemPost)) {
        return false;
    }
    return true;
});
