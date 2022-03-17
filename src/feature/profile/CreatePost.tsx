import {TypeCreatePostRequest, TypeCreatePostResponse} from 'api/interface';
import {apiEditPost} from 'api/module';
import AutoHeightImage from 'components/AutoHeightImage';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    goBack,
    navigate,
    popUpPicker,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    optionsImagePicker,
} from 'utility/assistant';

interface Props {
    route: {
        params: {
            // for edit post
            itemPostFromEdit?: TypeCreatePostResponse;
            editAPostInList?(params: {
                id: string;
                data: TypeCreatePostRequest;
            }): void;
        };
    };
}

const CreatePost = ({route}: Props) => {
    const itemPostFromEdit = route.params?.itemPostFromEdit;

    const {t} = useTranslation();
    const theme = Redux.getTheme();
    const {profile} = Redux.getPassport();
    const isModeExp = Redux.getModeExp();
    const {listHobbies} = Redux.getResource();

    const actionSheetRef = useRef<any>(null);
    const inputRef = useRef<TextInput>(null);

    const [caption, setCaption] = useState(itemPostFromEdit?.content || '');
    const [image, setImage] = useState(itemPostFromEdit?.images[0] || '');
    const [color, setColor] = useState<number | undefined>(
        itemPostFromEdit?.color || undefined,
    );
    const [name, setName] = useState<string | undefined>(
        itemPostFromEdit?.name || undefined,
    );

    const optionsImgPicker = optionsImagePicker.map(item => t(item));
    const titleButton = useMemo(
        () => (itemPostFromEdit ? 'profile.post.edit' : 'common.continue'),
        [],
    );

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

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

    const onComeBackMyProfile = useCallback(() => {
        navigate(PROFILE_ROUTE.myProfile);
    }, []);

    const onConfirm = async () => {
        // Create post
        if (!itemPostFromEdit) {
            const createData: TypeCreatePostRequest = {
                content: caption,
                images: image ? [image] : [],
                color,
                name,
            };
            navigate(PROFILE_ROUTE.createPostPreview, {
                createData,
            });
            return;
        }

        // Edit post
        const updateData: TypeCreatePostRequest = {};
        if (caption !== itemPostFromEdit.content) {
            updateData.content = caption;
        }
        if (image !== itemPostFromEdit.images[0]) {
            updateData.images = [image];
        }
        if (color !== itemPostFromEdit.color) {
            updateData.color = color;
        }
        if (name !== itemPostFromEdit.name) {
            updateData.name = name;
        }

        try {
            Redux.setIsLoading(true);
            if (!isModeExp) {
                await apiEditPost({
                    idPost: itemPostFromEdit.id,
                    data: updateData,
                });
            }
            route.params?.editAPostInList?.({
                id: itemPostFromEdit.id,
                data: updateData,
            });
            onComeBackMyProfile();
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    /**
     * Render view
     */
    const RenderHeader = useMemo(() => {
        const title = itemPostFromEdit
            ? 'profile.post.editPost'
            : 'profile.post.title';
        return <StyleHeader title={title} onGoBack={onComeBackMyProfile} />;
    }, [!!itemPostFromEdit]);

    const RenderInformation = useMemo(() => {
        return (
            <View style={styles.informationView}>
                <StyleImage
                    source={{uri: profile.avatar}}
                    customStyle={styles.avatar}
                />
                <StyleText
                    originValue={profile.name}
                    customStyle={[styles.textName, {color: theme.textColor}]}
                />
            </View>
        );
    }, [profile]);

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
                                defaultValue={name}
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

    const RenderToolView = useMemo(() => {
        return (
            <View style={styles.toolView}>
                {!(color && name) && (
                    <StyleTouchable onPress={onNavigatePicker}>
                        <Ionicons
                            name="ios-color-palette-outline"
                            style={[
                                styles.iconTheme,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
                <View style={{width: scale(30)}} />
                {!image && (
                    <StyleTouchable
                        onPress={() => actionSheetRef.current.show()}>
                        <Entypo
                            name="images"
                            style={[
                                styles.iconImage,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    }, [color, name, image, theme]);

    const RenderHobby = useMemo(() => {
        const hobby = listHobbies.find(item => item.id === color);
        if (!hobby) {
            return null;
        }

        const onResetNameAndColor = () => {
            setName('');
            setColor(undefined);
        };

        return (
            <View style={styles.hobbyView}>
                <View
                    style={[styles.hobbyBox, {borderColor: theme.borderColor}]}>
                    <StyleImage
                        source={{uri: hobby.icon}}
                        customStyle={styles.iconHobby}
                    />
                    <StyleText
                        originValue={name}
                        customStyle={[
                            styles.textHobby,
                            {color: theme.textColor},
                        ]}
                    />
                    <ButtonX
                        onPress={onResetNameAndColor}
                        containerStyle={styles.iconDelete}
                    />
                </View>
            </View>
        );
    }, [name, color, theme]);

    const RenderImage = useMemo(() => {
        return image ? (
            <View style={[styles.imageBox, {shadowColor: theme.textColor}]}>
                <AutoHeightImage uri={image} customStyle={styles.image} />
                {!itemPostFromEdit && (
                    <ButtonX
                        containerStyle={styles.iconDeleteImageTouch}
                        iconStyle={styles.iconDeleteImage}
                        onPress={() => setImage('')}
                    />
                )}
            </View>
        ) : null;
    }, [image, theme, itemPostFromEdit]);

    return (
        <>
            {RenderHeader}

            <StyleContainer
                contentContainerStyle={styles.container}
                scrollEnabled>
                {/* information */}
                {RenderInformation}

                {/* write caption */}
                <StyleInput
                    ref={inputRef}
                    value={caption}
                    onChangeText={text => setCaption(text)}
                    containerStyle={styles.captionView}
                    inputStyle={styles.inputCaption}
                    multiline
                    i18Placeholder="profile.post.caption"
                    returnKeyType="default"
                    hasErrorBox={false}
                    hasUnderLine={false}
                    isEffectTabBar={false}
                />

                {RenderToolView}

                {RenderHobby}

                {/* upload image */}
                {RenderImage}

                <StyleButton
                    title={titleButton}
                    containerStyle={styles.buttonPostView}
                    onPress={onConfirm}
                    disable={!(name && color && image)}
                />
            </StyleContainer>

            <ActionSheet
                ref={actionSheetRef}
                options={optionsImgPicker}
                cancelButtonIndex={2}
                onPress={onChooseAction}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '20@s',
        paddingBottom: '150@vs',
    },
    // information view
    informationView: {
        width: '100%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: '40@s',
        height: '40@s',
        borderRadius: '20@s',
    },
    textName: {
        fontSize: '17@ms',
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    // caption view
    captionView: {
        width: '100%',
        paddingTop: '10@vs',
        paddingBottom: '15@vs',
    },
    inputCaption: {
        fontSize: '15@ms',
    },
    // tool view
    toolView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: '14@vs',
    },
    iconUploadTopic: {
        width: '30@s',
        height: '50@s',
        resizeMode: 'contain',
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
    iconTheme: {
        fontSize: '35@ms',
    },
    iconImage: {
        fontSize: '30@ms',
    },
    inputContainer: {
        flex: 1,
    },
    inputOther: {
        width: '100%',
        paddingHorizontal: 0,
    },
    // hobby view
    hobbyView: {
        width: '100%',
        flexDirection: 'row',
    },
    hobbyBox: {
        flexDirection: 'row',
        borderWidth: '1@ms',
        borderRadius: '50@ms',
        paddingHorizontal: '15@s',
        paddingVertical: '8@vs',
        alignItems: 'center',
    },
    iconHobby: {
        width: '30@s',
        height: '30@s',
        marginRight: '15@s',
    },
    textHobby: {
        fontSize: '15@ms',
        marginRight: '20@s',
    },
    iconDelete: {
        position: 'relative',
        borderRadius: '30@ms',
        top: 0,
    },
    // image view
    imageBox: {
        width: '100%',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,
        marginTop: '30@vs',
    },
    image: {
        width: '100%',
        borderRadius: '13@s',
    },
    iconDeleteImageTouch: {
        right: '-12@ms',
        top: '-12@ms',
        borderRadius: '30@ms',
    },
    iconDeleteImage: {
        fontSize: '20@ms',
    },
    // button post
    buttonPostView: {
        marginTop: '50@vs',
    },
});

export default CreatePost;
