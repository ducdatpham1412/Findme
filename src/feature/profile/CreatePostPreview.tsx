import {useIsFocused} from '@react-navigation/native';
import {TypeCreatePostRequest} from 'api/interface';
import {apiCreatePost} from 'api/module';
import {RELATIONSHIP, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import ButtonBack from 'components/common/ButtonBack';
import IconLiked from 'components/common/IconLiked';
import StyleMoreText from 'components/StyleMoreText';
import IconHobby from 'feature/discovery/components/IconHobby';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {choosePrivateAvatar} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    route: {
        params: {
            createData: TypeCreatePostRequest;
        };
    };
}

const CreatePostPreview = ({route}: Props) => {
    const {createData} = route.params;

    const isFocused = useIsFocused();
    const {setShowTabBar} = useTabBar();
    const theme = Redux.getTheme();
    const {gender} = Redux.getPassport().information;
    const profile = Redux.getPassport().profile;
    const isModeExp = Redux.getModeExp();

    const [displayLayer, setDisplayLayer] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setShowTabBar(false);
        } else {
            setShowTabBar(true);
        }
    }, [isFocused]);

    const onConfirmPost = async () => {
        try {
            Redux.setIsLoading(true);

            if (!isModeExp) {
                const image = await ImageUploader.upLoad(
                    createData?.images?.[0] || '',
                    1000,
                );
                const res = await apiCreatePost({
                    ...createData,
                    images: [image],
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewPostFromProfile,
                    payload: res.data,
                });
            } else {
                const newPost = {
                    id: Math.random(),
                    content: createData.content,
                    images: createData.images,
                    totalLikes: 0,
                    creatorId: profile.id,
                    creatorName: profile.name,
                    creatorAvatar: profile.avatar,
                    createdTime: new Date(),
                    color: createData.color,
                    name: createData.name,
                    isLiked: false,
                    relationship: RELATIONSHIP.self,
                };
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewPostFromProfile,
                    payload: newPost,
                });
            }

            navigate(PROFILE_ROUTE.myProfile);
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    /**
     * Render view
     */
    const RenderImage = useMemo(() => {
        return (
            <View style={styles.imageView}>
                <StyleImage
                    source={{uri: createData?.images?.[0] || ''}}
                    customStyle={styles.image}
                />
            </View>
        );
    }, []);

    const RenderLayer = useMemo(() => {
        if (!displayLayer) {
            return null;
        }
        return <View style={styles.layerView} />;
    }, [displayLayer]);

    const RenderButtonComeback = useMemo(() => {
        return (
            <ButtonBack
                containerStyle={styles.buttonBackView}
                onPress={goBack}
            />
        );
    }, []);

    const RenderNameAvatarAndContent = useMemo(() => {
        return (
            <View style={styles.avatarNameContentView}>
                <View style={styles.avatarNameBox}>
                    <StyleText
                        originValue={`@${profile.anonymousName}`}
                        customStyle={styles.textName}
                    />
                </View>
                <View style={styles.contentBox}>
                    <StyleText
                        originValue={`🌙  ${createData.name}`}
                        customStyle={styles.textNameBubble}
                    />
                    <StyleMoreText
                        value={createData.content || ''}
                        textStyle={styles.textContent}
                    />
                </View>
            </View>
        );
    }, []);

    const RenderButtonPost = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={[
                    styles.buttonPostView,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                        borderColor: theme.borderColor,
                    },
                ]}
                onPress={onConfirmPost}>
                <StyleText
                    i18Text="profile.post.post"
                    customStyle={[
                        styles.textPost,
                        {color: theme.textHightLight},
                    ]}
                />
            </StyleTouchable>
        );
    }, [createData]);

    const RenderToolView = useMemo(() => {
        const avatar = choosePrivateAvatar(gender);

        return (
            <View style={styles.toolView}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatar}
                />

                <IconLiked customStyle={styles.iconLike} onPress={() => null} />

                {createData.color && (
                    <IconHobby
                        color={createData.color}
                        onTouchStart={() => setDisplayLayer(true)}
                        onTouchEnd={() => setDisplayLayer(false)}
                    />
                )}
            </View>
        );
    }, [gender]);

    return (
        <View style={styles.container}>
            {RenderImage}
            {RenderLayer}
            {RenderButtonComeback}
            {RenderNameAvatarAndContent}
            {RenderButtonPost}
            {RenderToolView}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    buttonBackView: {
        top: '10@s',
        left: '10@s',
        padding: '10@ms',
    },
    // image
    imageView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    // layer
    layerView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Theme.darkTheme.backgroundColor,
        opacity: 0.6,
    },
    // name and avatar and content
    avatarNameContentView: {
        position: 'absolute',
        top: '60@vs',
        left: '10@s',
        width: '70%',
    },
    avatarNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textName: {
        fontSize: '20@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    contentBox: {
        width: '100%',
        paddingTop: '7@vs',
    },
    textNameBubble: {
        fontSize: '18.5@ms',
        color: Theme.common.white,
        marginBottom: '10@vs',
    },
    textContent: {
        fontSize: '17@ms',
        color: Theme.common.white,
    },
    // button post
    buttonPostView: {
        position: 'absolute',
        bottom: '20@s',
        right: '20@s',
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        borderRadius: '20@s',
        borderWidth: '1@ms',
    },
    textPost: {
        fontWeight: 'bold',
    },
    // tool view
    toolView: {
        position: 'absolute',
        width: '100@s',
        paddingVertical: '10@vs',
        bottom: '230@s',
        right: 0,
        alignItems: 'center',
    },
    avatar: {
        width: '50@ms',
        height: '50@ms',
        borderRadius: '30@ms',
    },
    iconLike: {
        fontSize: '60@ms',
        marginTop: '30@vs',
    },
    // extension tool
    reportView: {
        position: 'absolute',
        width: '50@ms',
        top: Metrics.safeTopPadding + verticalScale(10),
        right: '10@s',
        alignItems: 'center',
        borderRadius: '30@ms',
    },
    iconMoon: {
        fontSize: '35@ms',
    },
});

export default CreatePostPreview;
