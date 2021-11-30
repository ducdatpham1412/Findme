import {TypeCreatePostResponse} from 'api/interface';
import {apiCreatePost, apiEditPost} from 'api/module';
import {Metrics} from 'asset/metrics';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {appAlert, goBack} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {scale, ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    optionsImagePicker,
} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    route: {
        params: {
            // for create post
            addAPostToList?(newPost: any): void;
            // for edit post
            itemPostFromEdit?: TypeCreatePostResponse;
            editAPostInList?(params: {id: string; newContent: string}): void;
        };
    };
}

const CreatePost = ({route}: Props) => {
    const addAPostToList = route.params?.addAPostToList;
    const itemPostFromEdit = route.params.itemPostFromEdit;

    const {t} = useTranslation();
    const theme = Redux.getTheme();
    const {profile} = Redux.getPassport();

    const actionSheetRef = useRef<any>(null);
    const inputRef = useRef<TextInput>(null);

    const [caption, setCaption] = useState(itemPostFromEdit?.content || '');
    const [image, setImage] = useState(itemPostFromEdit?.images[0] || '');

    const optionsImgPicker = optionsImagePicker.map(item => t(item));
    const titleButton = itemPostFromEdit
        ? 'profile.post.edit'
        : 'profile.post.post';

    useEffect(() => {
        if (itemPostFromEdit) {
            inputRef.current?.focus();
        }
    }, []);

    const onChooseAction = async (index: number) => {
        if (index === 0) {
            await chooseImageFromCamera(setImage, {
                freeStyleCrop: true,
            });
        } else if (index === 1) {
            await chooseImageFromLibrary(setImage, {
                freeStyleCrop: true,
            });
        }
    };

    const onPostImage = async () => {
        try {
            Redux.setIsLoading(true);

            // create post
            if (!itemPostFromEdit) {
                const tempImage = await ImageUploader.upLoad(image, 1080);
                const res = await apiCreatePost({
                    content: caption,
                    images: [tempImage],
                });
                addAPostToList?.(res.data);
                goBack();
            }

            // edit post
            if (itemPostFromEdit?.id) {
                await apiEditPost({
                    idPost: itemPostFromEdit.id,
                    newContent: caption,
                });
                route.params?.editAPostInList?.({
                    id: itemPostFromEdit?.id,
                    newContent: caption,
                });
                goBack();
            }
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
        return <StyleHeader title={title} />;
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

    const RenderImage = useMemo(() => {
        return image ? (
            <View style={[styles.imageBox, {shadowColor: theme.textColor}]}>
                <StyleImage source={{uri: image}} customStyle={styles.image} />
            </View>
        ) : (
            <StyleTouchable
                customStyle={[
                    styles.uploadTouch,
                    {borderColor: theme.borderColor},
                ]}
                onPress={() => actionSheetRef.current.show()}>
                <Feather
                    name="upload"
                    style={[styles.iconUpload, {color: theme.borderColor}]}
                />
            </StyleTouchable>
        );
    }, [image]);

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
                />

                {/* upload image */}
                <View style={styles.uploadImageView}>{RenderImage}</View>

                {!!image && (
                    <StyleButton
                        title={titleButton}
                        containerStyle={styles.buttonPostView}
                        onPress={onPostImage}
                    />
                )}
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
    },
    inputCaption: {
        fontSize: '15@ms',
    },
    // upload image view
    uploadImageView: {
        width: '100%',
        minHeight: '200@vs',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5@vs',
    },
    uploadTouch: {
        width: '50@s',
        height: '50@s',
        borderWidth: 0.7,
        borderRadius: '10@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconUpload: {
        fontSize: '20@ms',
    },
    imageBox: {
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,
    },
    image: {
        width: Metrics.width - scale(100),
        height: Metrics.width - scale(100),
        borderRadius: '13@s',
    },
    // button post
    buttonPostView: {
        marginTop: '50@vs',
    },
});

export default CreatePost;
