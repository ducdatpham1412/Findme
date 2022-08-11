import {TypeBubblePalace, TypeEditPostRequest} from 'api/interface';
import {apiCreatePost, apiEditPost} from 'api/module';
import {RELATIONSHIP, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import ButtonBack from 'components/common/ButtonBack';
import StyleMoreText from 'components/StyleMoreText';
import {bubbleHeight} from 'feature/discovery/components/Bubble';
import Redux from 'hook/useRedux';
import {appAlert, goBack, popUpPicker} from 'navigation/NavigationService';
import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, ScrollView, TextInput, Vibration, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    logger,
    optionsImagePicker,
} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    route: {
        params: {
            itemPostFromEdit?: TypeBubblePalace;
        };
    };
}

const CreatePostPreview = ({route}: Props) => {
    const itemPostFromEdit = route.params?.itemPostFromEdit;

    const {t} = useTranslation();

    const theme = Redux.getTheme();
    const {profile} = Redux.getPassport();
    const isModeExp = Redux.getModeExp();
    const {listHobbies} = Redux.getResource();

    const actionSheetRef = useRef<any>(null);
    const scaleIconColor = useRef(new Animated.Value(1)).current;
    const scrollContentRef = useRef<ScrollView>(null);
    const inputContentRef = useRef<TextInput>(null);

    const [content, setContent] = useState(itemPostFromEdit?.content);
    const [images, setImages] = useState(itemPostFromEdit?.images);
    const [stars, setStars] = useState(itemPostFromEdit?.stars);
    const [topic, setTopic] = useState(itemPostFromEdit?.topic);
    const [feeling, setFeeling] = useState(itemPostFromEdit?.feeling);
    const [location, setLocation] = useState(itemPostFromEdit?.location);
    const [link, setLink] = useState(itemPostFromEdit?.link);

    const [displayLayer, setDisplayLayer] = useState(false);
    const [displayLayerContent, setDisplayLayerContent] = useState(false);

    const optionsImgPicker = optionsImagePicker.map(text => t(text));

    const onConfirmPost = async () => {
        if (topic === undefined) {
            Vibration.vibrate();
            Animated.spring(scaleIconColor, {
                toValue: 2.3,
                useNativeDriver: true,
                speed: 20,
            }).start(() => {
                Animated.spring(scaleIconColor, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 20,
                }).start();
            });
            return;
        }

        logger(setStars, setTopic, setFeeling, setLocation, setLink);

        /**
         * Edit post
         */
        if (itemPostFromEdit) {
            Redux.setIsLoading(true);
            const updateData: TypeEditPostRequest = {};
            if (content !== itemPostFromEdit.content) {
                updateData.content = content;
            }
            // Not let user edit images
            // if (images !== itemPostFromEdit.images && images?.length) {
            //     updateData.images = await ImageUploader.upLoadManyImg(
            //         images,
            //         1000,
            //     );
            // }
            if (stars !== itemPostFromEdit.stars) {
                updateData.stars = stars;
            }
            if (topic !== itemPostFromEdit.topic) {
                updateData.topic = topic;
            }
            if (feeling !== itemPostFromEdit.feeling) {
                updateData.feeling = feeling;
            }
            if (location !== itemPostFromEdit.location) {
                updateData.location = location;
            }
            if (link !== itemPostFromEdit.link) {
                updateData.link = link;
            }

            try {
                if (!isModeExp) {
                    await apiEditPost({
                        idPost: itemPostFromEdit.id,
                        data: updateData,
                    });
                }
                updateData.images = images;
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editPostFromProfile,
                    payload: {
                        id: itemPostFromEdit.id,
                        ...updateData,
                    },
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
            return;
        }

        /**
         * Create post
         */
        if (content && images?.length && stars) {
            try {
                Redux.setIsLoading(true);
                if (!isModeExp) {
                    const uploadImages = await ImageUploader.upLoadManyImg(
                        images,
                        1000,
                    );

                    const res = await apiCreatePost({
                        content,
                        images: uploadImages,
                        stars,
                        topic,
                        feeling,
                        location,
                        link,
                    });
                    Redux.setBubblePalaceAction({
                        action: TYPE_BUBBLE_PALACE_ACTION.createNewPostFromProfile,
                        payload: res.data,
                    });
                } else {
                    const newPost: TypeBubblePalace = {
                        id: String(Math.random()),
                        content,
                        images,
                        topic,
                        feeling: feeling || 0,
                        stars,
                        location: location || '',
                        link: link || '',
                        totalLikes: 100,
                        totalComments: 100,
                        creator: profile.id,
                        creatorName: profile.name,
                        creatorAvatar: profile.avatar,
                        created: String(new Date()),
                        isLiked: true,
                        relationship: RELATIONSHIP.self,
                    };
                    Redux.setBubblePalaceAction({
                        action: TYPE_BUBBLE_PALACE_ACTION.createNewPostFromProfile,
                        payload: newPost,
                    });
                }

                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    const onChooseAction = useCallback(async (index: number) => {
        if (index === 0) {
            await chooseImageFromCamera(setImages, {
                freeStyleCrop: true,
                maxWidth: Metrics.width,
                maxHeight: bubbleHeight,
                multiple: false,
                maxFiles: 10,
            });
        } else if (index === 1) {
            await chooseImageFromLibrary(setImages, {
                freeStyleCrop: true,
                maxWidth: Metrics.width,
                maxHeight: bubbleHeight,
                multiple: false,
                maxFiles: 10,
            });
        }
    }, []);

    /**
     * Render view
     */
    const RenderImage = () => {
        if (!images?.length) {
            return null;
        }
        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onLongPress={() => setDisplayLayer(true)}
                onPressOut={() => setDisplayLayer(false)}>
                <StyleImage
                    source={{uri: images[0]}}
                    customStyle={styles.image}
                />
            </StyleTouchHaveDouble>
        );
    };

    const RenderLayer = () => {
        if (!displayLayer) {
            return null;
        }
        return (
            <View
                style={[
                    styles.layerView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        );
    };

    const RenderLayerContent = () => {
        if (!displayLayerContent) {
            return null;
        }
        return (
            <View
                style={[
                    styles.layerView,
                    {backgroundColor: theme.backgroundColor},
                ]}
                onTouchEnd={() => setDisplayLayerContent(false)}
            />
        );
    };

    const RenderButtonComeback = () => {
        return (
            <ButtonBack
                containerStyle={styles.buttonBackView}
                onPress={goBack}
            />
        );
    };

    const RenderName = () => {
        const textColor = theme.textHightLight;
        return (
            <View style={styles.nameView}>
                <View style={styles.avatarNameBox}>
                    <StyleText
                        originValue={`@${profile.name}`}
                        customStyle={[styles.textName, {color: textColor}]}
                    />
                </View>
            </View>
        );
    };

    const showEditCaption = useCallback(() => {
        setDisplayLayerContent(true);
        setTimeout(() => {
            inputContentRef.current?.focus();
        }, 100);
    }, []);

    const RenderContent = () => {
        return (
            <Animated.View style={styles.contentView}>
                {!displayLayerContent ? (
                    <StyleMoreText
                        value={content}
                        textStyle={[
                            styles.textContent,
                            {color: theme.textHightLight},
                        ]}
                        onPress={showEditCaption}
                    />
                ) : (
                    <ScrollView
                        ref={scrollContentRef}
                        style={{height: verticalScale(200)}}
                        onContentSizeChange={() =>
                            scrollContentRef.current?.scrollToEnd()
                        }
                        onTouchEnd={() => setDisplayLayerContent(false)}>
                        <StyleInput
                            ref={inputContentRef}
                            editable={displayLayerContent}
                            value={content}
                            onChangeText={text => setContent(text)}
                            hasErrorBox={false}
                            hasUnderLine={false}
                            placeholder="Aa"
                            containerStyle={{width: '100%'}}
                            inputStyle={[
                                styles.textContent,
                                {color: theme.textHightLight},
                            ]}
                            onPressOut={() => null}
                            multiline
                            isEffectTabBar={false}
                        />
                    </ScrollView>
                )}
            </Animated.View>
        );
    };

    const RenderToolUp = () => {
        return (
            <View style={styles.toolUpView}>
                <StyleTouchHaveDouble
                    customStyle={[
                        styles.iconToolUpBox,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}
                    onPressOut={showEditCaption}>
                    <StyleText
                        originValue="Aa"
                        customStyle={{color: theme.textHightLight}}
                    />
                </StyleTouchHaveDouble>

                {(!itemPostFromEdit || !itemPostFromEdit.images[0]) && (
                    <StyleTouchable
                        style={[
                            styles.iconToolUpBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() => actionSheetRef.current?.show()}
                        activeOpacity={0.9}>
                        <Entypo
                            name="images"
                            style={[
                                styles.iconImage,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const onNavigatePicker = () => {
        popUpPicker({
            data: listHobbies,
            renderItem: (item: any) => {
                if (item.id === 8) {
                    return (
                        <View style={styles.elementPicker}>
                            <StyleImage
                                source={{uri: item.icon}}
                                customStyle={styles.iconPicker}
                            />
                            <StyleInput
                                defaultValue={''}
                                onChangeText={() => null}
                                containerStyle={styles.inputContainer}
                                inputStyle={[
                                    styles.inputOther,
                                    {color: theme.textHightLight},
                                ]}
                                hasErrorBox={false}
                                hasUnderLine={false}
                                maxLength={50}
                                i18Placeholder="profile.post.enterTopic"
                                placeholderTextColor={theme.holderColorLighter}
                                isEffectTabBar={false}
                            />
                        </View>
                    );
                }
                return (
                    <View style={styles.elementPicker}>
                        <StyleImage
                            source={{uri: item.icon}}
                            customStyle={styles.iconPicker}
                        />
                        <StyleText
                            originValue={item.name}
                            customStyle={[
                                styles.textPicker,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                );
            },
            itemHeight: verticalScale(70),
            onSetItemSelected: (hobby: any) => {
                logger(hobby);
            },
            initIndex: listHobbies.findIndex(item => item.id === topic),
            onCancel: goBack,
        });
    };

    const RenderTollRight = () => {
        return (
            <View style={styles.toolView}>
                <Animated.View
                    style={[
                        styles.iconThemeBox,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                            transform: [{scale: scaleIconColor}],
                        },
                    ]}>
                    <Ionicons
                        name="ios-color-palette-outline"
                        style={[
                            styles.iconTheme,
                            {color: theme.highlightColor},
                        ]}
                        onPress={onNavigatePicker}
                    />
                </Animated.View>
            </View>
        );
    };

    const RenderButtonPost = () => {
        const titleButton = itemPostFromEdit
            ? 'profile.post.edit'
            : 'profile.post.post';
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
                    i18Text={titleButton}
                    customStyle={[
                        styles.textPost,
                        {color: theme.textHightLight},
                    ]}
                />
            </StyleTouchable>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {RenderImage()}
            {RenderButtonComeback()}

            <ButtonBack
                containerStyle={styles.buttonBackView}
                onPress={goBack}
            />

            {RenderToolUp()}
            {RenderLayer()}
            {RenderName()}
            {RenderButtonPost()}
            {RenderTollRight()}

            {RenderLayerContent()}
            {RenderContent()}

            <ActionSheet
                ref={actionSheetRef}
                options={optionsImgPicker}
                cancelButtonIndex={2}
                onPress={onChooseAction}
            />
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
        resizeMode: 'contain',
    },
    // layer
    layerView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    // name and avatar and content
    nameView: {
        position: 'absolute',
        top: '70@ms',
        left: '10@s',
        width: '70%',
        height: '70@ms',
    },
    avatarNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textName: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    // content view
    contentView: {
        position: 'absolute',
        left: '10@s',
        top: '140@ms',
        width: '70%',
    },
    textContent: {
        fontSize: '17@ms',
        paddingHorizontal: 0,
    },
    // tool up
    toolUpView: {
        position: 'absolute',
        top: '10@vs',
        right: '20@s',
        width: '150@ms',
        height: '50@ms',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    iconToolUpBox: {
        borderRadius: '30@ms',
        width: '50@ms',
        height: '50@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        fontSize: '23@ms',
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
    iconThemeBox: {
        marginTop: '50@vs',
        padding: '8@ms',
        borderRadius: '30@ms',
    },
    iconTheme: {
        fontSize: '40@ms',
    },
    elementPicker: {
        width: '70%',
        height: '70@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconPicker: {
        width: '40@vs',
        height: '40@vs',
        marginRight: '20@s',
    },
    textPicker: {
        fontWeight: 'bold',
    },
    inputContainer: {
        flex: 1,
    },
    inputOther: {
        width: '100%',
        paddingHorizontal: 0,
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
