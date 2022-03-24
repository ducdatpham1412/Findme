import {TypeCreatePostResponse} from 'api/interface';
import {apiLikePost, apiUnLikePost} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import AutoHeightImage from 'components/AutoHeightImage';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Redux from 'hook/useRedux';
import {appAlert, showSwipeImages} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {chooseIconHobby, modalizeOptionPost} from 'utility/assistant';

interface PostStatusProps {
    itemPost: TypeCreatePostResponse;
    deleteAPostInList?(idPost: string): void;
}

const PostStatus = (props: PostStatusProps) => {
    const {itemPost, deleteAPostInList} = props;

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const optionsRef = useRef<any>(null);

    const [isLiked, setIsLiked] = useState(itemPost.isLiked);
    const [numberLikes, setNumberLikes] = useState(itemPost.totalLikes);

    const isMyPost = itemPost.relationship === RELATIONSHIP.self;

    const onPressHeart = async () => {
        const currentLike = isLiked;
        const currentNumber = numberLikes;
        try {
            setIsLiked(!currentLike);
            const newNumber = currentLike ? numberLikes - 1 : numberLikes + 1;
            setNumberLikes(newNumber);
            if (!isModeExp) {
                if (currentLike) {
                    await apiUnLikePost(itemPost.id);
                } else {
                    await apiLikePost(itemPost.id);
                }
            }
        } catch (err) {
            setIsLiked(currentLike);
            setNumberLikes(currentNumber);
            appAlert(err);
        }
    };

    const onShowOptionPost = () => {
        optionsRef.current.show();
    };

    const onSeeDetailImage = () => {
        const listImages = itemPost.images.map(item => ({
            url: item,
        }));
        showSwipeImages({
            listImages,
        });
    };

    /**
     * Render view
     */
    const RenderBackground = useMemo(() => {
        return (
            <View
                style={[
                    styles.spaceContainer,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    }, [theme]);

    const RenderAvatarNameOption = useMemo(() => {
        return (
            <View style={styles.creatorView}>
                <View style={styles.avatarNameBox}>
                    <StyleImage
                        source={{uri: itemPost.creatorAvatar}}
                        customStyle={styles.avatar}
                    />
                    <StyleText
                        originValue={itemPost.creatorName}
                        customStyle={[
                            styles.textName,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {isMyPost && (
                    <StyleTouchable
                        style={styles.buttonIconMore}
                        onPress={onShowOptionPost}>
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
    }, [itemPost.creatorAvatar, itemPost.creatorName, theme]);

    const RenderCaption = useMemo(() => {
        if (!itemPost.content) {
            return null;
        }

        const fontSize = itemPost.images[0]
            ? moderateScale(15)
            : moderateScale(20);

        return (
            <View style={styles.captionView}>
                <StyleText
                    originValue={itemPost.content}
                    customStyle={[
                        styles.textContent,
                        {color: theme.textColor, fontSize},
                    ]}
                />
            </View>
        );
    }, [itemPost.content, theme, itemPost.images]);

    const RenderImage = useMemo(() => {
        if (!itemPost.images[0]) {
            return null;
        }
        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onDoubleClick={() => {
                    if (!isLiked) {
                        onPressHeart();
                    } else {
                        onSeeDetailImage();
                    }
                }}>
                <AutoHeightImage
                    uri={itemPost.images[0]}
                    customStyle={styles.image}
                />
            </StyleTouchHaveDouble>
        );
    }, [itemPost.images, isLiked]);

    const RenderLikeBox = useMemo(() => {
        return (
            <>
                {isLiked ? (
                    <IconLiked
                        onPress={onPressHeart}
                        customStyle={styles.heartIcon}
                    />
                ) : (
                    <IconNotLiked
                        onPress={onPressHeart}
                        customStyle={[
                            styles.heartIcon,
                            {
                                color: theme.unLikeHeart,
                            },
                        ]}
                    />
                )}

                {!!numberLikes && (
                    <StyleText
                        originValue={numberLikes}
                        customStyle={[
                            styles.textNumberLike,
                            {
                                color: isLiked
                                    ? Theme.common.pink
                                    : theme.unLikeHeart,
                            },
                        ]}
                    />
                )}
            </>
        );
    }, [isLiked, numberLikes, theme]);

    const RenderIconHobby = useMemo(() => {
        return (
            <StyleImage
                source={{uri: chooseIconHobby(itemPost.color)}}
                customStyle={styles.iconHobby}
            />
        );
    }, [itemPost.color]);

    return (
        <View style={styles.container}>
            {RenderBackground}
            {RenderAvatarNameOption}
            {RenderCaption}
            {RenderImage}

            <View style={styles.interactView}>
                {RenderLikeBox}
                {RenderIconHobby}
            </View>

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={modalizeOptionPost({
                    itemPostFromEdit: itemPost,
                    deleteAPostInList: deleteAPostInList,
                })}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '99%',
        marginTop: '20@vs',
        alignSelf: 'center',
    },
    spaceContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '20@s',
        opacity: 0.8,
    },
    // avatar and name
    creatorView: {
        width: '100%',
        paddingHorizontal: '15@s',
        flexDirection: 'row',
        marginTop: '15@vs',
    },
    avatarNameBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '15@s',
    },
    avatar: {
        width: '30@s',
        height: '30@s',
        borderRadius: '20@s',
        marginRight: '10@s',
    },
    textName: {
        fontSize: '17@ms',
        fontWeight: 'bold',
    },
    buttonIconMore: {
        alignSelf: 'flex-end',
    },
    iconMore: {
        fontSize: '20@ms',
    },
    // caption
    captionView: {
        width: '100%',
        paddingHorizontal: '15@s',
        marginTop: '15@vs',
    },
    textContent: {
        fontSize: '15@ms',
    },
    // image
    imageView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10@s',
        marginTop: '15@vs',
    },
    image: {
        width: '100%',
        borderRadius: '10@s',
    },
    // heart icon
    interactView: {
        width: '100%',
        paddingVertical: '10@vs',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        marginRight: '20@s',
    },
    textNumberLike: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    // icon hobby
    iconHobby: {
        position: 'absolute',
        left: '20@s',
        width: '40@ms',
        height: '40@ms',
    },
});

export default PostStatus;
