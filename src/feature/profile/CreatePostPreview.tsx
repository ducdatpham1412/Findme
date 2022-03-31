import {useIsFocused} from '@react-navigation/native';
import {TypeBubblePalace, TypeCreatePostRequest} from 'api/interface';
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
import IconHobby from 'feature/discovery/components/IconHobby';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {useTabBar} from 'navigation/config/TabBarProvider';
import {
    appAlert,
    goBack,
    navigate,
    popUpPicker,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, ScrollView, TextInput, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
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

    const isFocused = useIsFocused();
    const {t} = useTranslation();
    const {setShowTabBar} = useTabBar();
    const theme = Redux.getTheme();
    const {gender} = Redux.getPassport().information;
    const profile = Redux.getPassport().profile;
    const isModeExp = Redux.getModeExp();
    const {listHobbies} = Redux.getResource();

    const actionSheetRef = useRef<any>(null);
    const scaleIconColor = useRef(new Animated.Value(1)).current;
    const scrollContentRef = useRef<ScrollView>(null);
    const inputContentRef = useRef<TextInput>(null);

    const [content, setContent] = useState(itemPostFromEdit?.content || '');
    const [image, setImage] = useState(itemPostFromEdit?.images[0] || '');
    const [color, setColor] = useState<number | undefined>(
        itemPostFromEdit?.color,
    );
    const [name, setName] = useState(itemPostFromEdit?.name || '');

    const [displayLayer, setDisplayLayer] = useState(false);
    const [displayLayerContent, setDisplayLayerContent] = useState(false);

    const optionsImgPicker = optionsImagePicker.map(text => t(text));

    useEffect(() => {
        if (isFocused) {
            setShowTabBar(false);
        } else {
            setShowTabBar(true);
        }
    }, [isFocused]);

    const onConfirmPost = async () => {
        if (color === undefined) {
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

        /**
         * Edit post
         */
        if (itemPostFromEdit) {
            Redux.setIsLoading(true);
            const updateData: TypeCreatePostRequest = {};
            if (content !== itemPostFromEdit.content) {
                updateData.content = content;
            }
            if (image !== itemPostFromEdit.images[0]) {
                const temp = await ImageUploader.upLoad(image, 1000);
                updateData.images = [temp];
            }
            if (color !== itemPostFromEdit.color) {
                updateData.color = color;
            }
            if (name !== itemPostFromEdit.name) {
                updateData.name = name;
            }

            try {
                if (!isModeExp) {
                    await apiEditPost({
                        idPost: itemPostFromEdit.id,
                        data: updateData,
                    });
                }
                updateData.images = [image];
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
        try {
            Redux.setIsLoading(true);

            if (!isModeExp) {
                const uploadImage = image
                    ? await ImageUploader.upLoad(image, 1000)
                    : '';
                const res = await apiCreatePost({
                    content,
                    images: image ? [uploadImage] : [],
                    color,
                    name,
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewPostFromProfile,
                    payload: res.data,
                });
            } else {
                const newPost = {
                    id: Math.random(),
                    content,
                    images: [image],
                    totalLikes: 0,
                    creatorId: profile.id,
                    creatorName: profile.name,
                    creatorAvatar: profile.avatar,
                    createdTime: new Date(),
                    color,
                    name,
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

    const onChooseAction = useCallback(async (index: number) => {
        if (index === 0) {
            await chooseImageFromCamera(setImage, {
                freeStyleCrop: true,
            });
        } else if (index === 1) {
            await chooseImageFromLibrary(setImage, {
                freeStyleCrop: true,
            });
        }
    }, []);

    /**
     * Render view
     */
    const RenderImage = useMemo(() => {
        if (!image) {
            return null;
        }
        return (
            <StyleTouchHaveDouble
                customStyle={styles.imageView}
                onLongPress={() => setDisplayLayer(true)}
                onPressOut={() => setDisplayLayer(false)}>
                <StyleImage source={{uri: image}} customStyle={styles.image} />
            </StyleTouchHaveDouble>
        );
    }, [image]);

    const RenderLayer = useMemo(() => {
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
    }, [displayLayer, theme]);

    const RenderLayerContent = useMemo(() => {
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
    }, [displayLayerContent, theme]);

    const RenderButtonComeback = useMemo(() => {
        return (
            <ButtonBack
                containerStyle={styles.buttonBackView}
                onPress={goBack}
            />
        );
    }, []);

    const RenderName = useMemo(() => {
        const textColor = theme.textHightLight;
        return (
            <View style={styles.nameView}>
                <View style={styles.avatarNameBox}>
                    <StyleText
                        originValue={`@${profile.anonymousName}`}
                        customStyle={[styles.textName, {color: textColor}]}
                    />
                </View>

                <StyleText
                    originValue={`🌙  ${name}`}
                    customStyle={[styles.textNameBubble, {color: textColor}]}
                />
            </View>
        );
    }, [name, content, theme]);

    const showEditCaption = useCallback(() => {
        setDisplayLayerContent(true);
        setTimeout(() => {
            inputContentRef.current?.focus();
        }, 100);
    }, []);

    const RenderContent = useMemo(() => {
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
    }, [content, image, displayLayerContent, theme]);

    const RenderToolUp = useMemo(() => {
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
    }, []);

    const onNavigatePicker = useCallback(() => {
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
                                onChangeText={text => setName(text)}
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
                console.log('choosing: ', hobby);
                if (hobby.id === 8) {
                    // setName(nameIfChooseOther);
                    setColor(hobby.id);
                } else {
                    setColor(hobby.id);
                    setName(hobby.name);
                }
            },
            initIndex: listHobbies.findIndex(item => item.id === color),
            onCancel: () => {
                setName(name);
                goBack();
            },
        });
    }, [color, name, theme]);

    const RenderTollRight = useMemo(() => {
        // const avatar = choosePrivateAvatar(gender);

        return (
            <View style={styles.toolView}>
                {/* <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatar}
                />

                <IconLiked customStyle={styles.iconLike} onPress={() => null} /> */}

                {color ? (
                    <IconHobby
                        color={color}
                        onTouchStart={() => null}
                        onTouchEnd={onNavigatePicker}
                    />
                ) : (
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
                )}
            </View>
        );
    }, [gender, color, name]);

    const RenderButtonPost = useMemo(() => {
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
    }, [content, image, color, name]);

    return (
        <View style={styles.container}>
            {RenderImage}
            {RenderButtonComeback}
            {RenderToolUp}
            {RenderLayer}
            {RenderName}
            {RenderButtonPost}
            {RenderTollRight}

            {RenderLayerContent}
            {RenderContent}

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
    textNameBubble: {
        fontSize: '18.5@ms',
        marginTop: '7@ms',
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
