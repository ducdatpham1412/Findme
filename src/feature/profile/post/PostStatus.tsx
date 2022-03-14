import {TypeCreatePostResponse} from 'api/interface';
import {apiLikePost, apiUnLikePost} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Redux from 'hook/useRedux';
import {appAlert, showSwipeImages} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {modalizeOptionPost} from 'utility/assistant';

interface PostStatusProps {
    itemPost: TypeCreatePostResponse;
    editAPostInList?(params: {id: string; newContent: string}): void;
    deleteAPostInList?(idPost: string): void;
}

const PostStatus = (props: PostStatusProps) => {
    const {itemPost, editAPostInList, deleteAPostInList} = props;

    const theme = Redux.getTheme();

    const optionsRef = useRef<any>(null);

    const [imageSize, setImageSize] = useState({
        width: 1,
        height: 1,
    });
    const [isLiked, setIsLiked] = useState(itemPost.isLiked);
    const [numberLikes, setNumberLikes] = useState(itemPost.totalLikes);

    const isMyPost = itemPost.relationship === RELATIONSHIP.self;

    const getSizeImage = () => {
        Image.getSize(itemPost.images[0], (width, height) => {
            setImageSize({
                width,
                height,
            });
        });
    };

    useEffect(() => {
        getSizeImage();
    }, []);

    const onPressHeart = async () => {
        const currentLike = isLiked;
        const currentNumber = numberLikes;
        try {
            setIsLiked(!currentLike);
            const newNumber = currentLike ? numberLikes - 1 : numberLikes + 1;
            setNumberLikes(newNumber);
            if (currentLike) {
                await apiUnLikePost(itemPost.id);
            } else {
                await apiLikePost(itemPost.id);
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

    // render_view
    const RenderIconLike = useMemo(() => {
        if (isLiked) {
            return (
                <IconLiked
                    onPress={onPressHeart}
                    customStyle={styles.heartIcon}
                />
            );
        }
        return (
            <IconNotLiked
                onPress={onPressHeart}
                customStyle={styles.heartIcon}
            />
        );
    }, [isLiked]);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.spaceContainer,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />

            {/* avatar, name and option post */}
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
                            {color: theme.borderColor},
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

            {/* caption */}
            <View style={styles.captionView}>
                <StyleText
                    originValue={itemPost.content}
                    customStyle={[styles.textContent, {color: theme.textColor}]}
                />
            </View>

            {/* image */}
            <StyleTouchable
                customStyle={styles.imageView}
                activeOpacity={0.95}
                onPress={onSeeDetailImage}
                onDoublePress={() => {
                    if (!isLiked) {
                        onPressHeart();
                    }
                }}>
                <StyleImage
                    source={{uri: itemPost.images[0]}}
                    customStyle={[
                        styles.image,
                        {
                            height:
                                Metrics.width *
                                (imageSize.height / imageSize.width),
                        },
                    ]}
                />
            </StyleTouchable>

            <View style={styles.heartNumberLikeBox}>
                {RenderIconLike}
                {!!numberLikes && (
                    <StyleText
                        originValue={numberLikes}
                        customStyle={[
                            styles.textNumberLike,
                            {color: Theme.common.pink},
                        ]}
                    />
                )}
            </View>

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={modalizeOptionPost({
                    itemPostFromEdit: itemPost,
                    editAPostInList: editAPostInList,
                    deleteAPostInList: deleteAPostInList,
                })}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '90%',
        marginBottom: '20@vs',
        marginTop: '20@vs',
        alignSelf: 'center',
    },
    spaceContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '20@s',
        opacity: 0.6,
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
        fontSize: '14@ms',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    buttonIconMore: {
        alignSelf: 'flex-end',
        marginTop: '0@vs',
    },
    iconMore: {
        fontSize: '17@ms',
    },
    // caption
    captionView: {
        width: '100%',
        paddingTop: '7@vs',
        paddingBottom: '10@vs',
        paddingHorizontal: '15@s',
    },
    textContent: {
        fontSize: '13@ms',
        fontStyle: 'italic',
    },
    // image
    imageView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '15@s',
    },
    image: {
        width: '100%',
        maxHeight: '500@vs',
        borderRadius: '10@s',
        backgroundColor: 'transparent',
    },
    // heart icon
    heartNumberLikeBox: {
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
        marginTop: '5@vs',
    },
});

export default PostStatus;
