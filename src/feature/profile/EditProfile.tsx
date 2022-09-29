import {apiEditProfile} from 'api/module';
import FindmeStore from 'app-redux/store';
import {AVATAR_SIZE} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleTouchable,
} from 'components/base';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {SharedElement} from 'react-navigation-shared-element';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    seeDetailImage,
} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';
import BtnPenEdit from './components/BtnPenEdit';

const EditProfile = () => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();
    const isLoading = Redux.getIsLoading();

    const inputDescriptionRef = useRef<TextInput>(null);
    const actionRef = useRef<any>(null);
    const [avatar, setAvatar] = useState(profile?.avatar);
    const [name, setName] = useState(profile?.name);
    const [description, setDescription] = useState(profile?.description);

    const disableButton = !name;

    const listTextAndOption = useMemo(() => {
        return [
            {
                text: 'common.chooseFromCamera',
                action: async () =>
                    chooseImageFromCamera((path: string) => setAvatar(path), {
                        maxWidth: AVATAR_SIZE.width,
                        maxHeight: AVATAR_SIZE.height,
                    }),
            },
            {
                text: 'common.chooseFromLibrary',
                action: async () =>
                    chooseImageFromLibrary(
                        (path: string) => {
                            setAvatar(path);
                        },
                        {
                            maxWidth: AVATAR_SIZE.width,
                            maxHeight: AVATAR_SIZE.height,
                        },
                    ),
            },
            {
                text: 'profile.removeAvatar',
                action: () => setAvatar(''),
            },
            {
                text: 'common.cancel',
                action: () => null,
            },
        ];
    }, []);

    const onSaveChange = async () => {
        try {
            Redux.setIsLoading(true);
            const {modeExp} = FindmeStore.getState().accountSlice;
            const {token} = FindmeStore.getState().logicSlice;

            if (!modeExp && token) {
                let newAvatar;
                if (avatar !== profile.avatar) {
                    if (avatar === '') {
                        newAvatar = '';
                    } else {
                        newAvatar = await ImageUploader.upLoad(avatar, 1000);
                    }
                }

                const newName = name === profile.name ? undefined : name;
                const newDescription =
                    description === profile.description
                        ? undefined
                        : description;

                await apiEditProfile({
                    avatar: newAvatar,
                    name: newName,
                    description: newDescription,
                });
            }

            Redux.updatePassport({
                profile: {avatar: avatar || '', name, description},
            });

            appAlert('alert.successUpdatePro', {
                actionClickOk: () => navigate(PROFILE_ROUTE.myProfile),
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <>
            <ViewSafeTopPadding />
            <StyleHeader title="profile.component.infoProfile.editProfile" />

            <StyleContainer scrollEnabled customStyle={styles.container}>
                <View style={styles.avatarBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.avatar,
                            {
                                borderColor: theme.borderColor,
                                backgroundColor: theme.backgroundColor,
                            },
                        ]}
                        onPress={() => {
                            if (avatar) {
                                seeDetailImage({
                                    images: [avatar],
                                });
                            }
                        }}
                        onLongPress={() => actionRef.current.show()}>
                        <SharedElement
                            id="avatar_share"
                            style={styles.avatarImg}>
                            <StyleImage
                                source={{uri: avatar}}
                                customStyle={styles.avatarImg}
                            />
                        </SharedElement>
                    </StyleTouchable>

                    <BtnPenEdit
                        btnStyle={styles.btnEditAvatar}
                        onPress={() => actionRef.current.show()}
                    />

                    <StyleActionSheet
                        ref={actionRef}
                        listTextAndAction={listTextAndOption}
                    />
                </View>

                <View style={styles.nameBox}>
                    <StyleInput
                        value={name}
                        i18Placeholder="profile.edit.name"
                        onChangeText={value => setName(value)}
                        inputStyle={styles.inputName}
                        maxLength={100}
                    />
                </View>

                <StyleTouchable
                    customStyle={[
                        styles.descriptionBox,
                        {borderColor: theme.borderColor},
                    ]}
                    activeOpacity={1}
                    onPress={() => inputDescriptionRef.current?.focus()}>
                    <StyleInput
                        ref={inputDescriptionRef}
                        value={description}
                        i18Placeholder="About me"
                        multiline
                        onChangeText={value => setDescription(value)}
                        containerStyle={{width: '100%'}}
                        inputStyle={styles.inputDescription}
                        hasUnderLine={false}
                        hasErrorBox={false}
                        maxLength={1000}
                    />
                </StyleTouchable>

                <StyleButton
                    title="profile.edit.confirmButton"
                    containerStyle={styles.saveBtnView}
                    onPress={onSaveChange}
                    disable={disableButton}
                />

                {isLoading && <LoadingScreen />}
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    // avatar
    avatarBox: {
        width: '200@s',
        height: '200@s',
        marginTop: '10@vs',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderWidth: '2@ms',
        borderRadius: '200@s',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '100@vs',
    },
    btnEditAvatar: {
        width: '27@ms',
        height: '27@ms',
        bottom: '10@s',
        left: '20@s',
    },
    // name
    nameBox: {
        height: '50@vs',
        width: '80%',
        marginTop: '40@vs',
        alignSelf: 'center',
    },
    inputName: {
        fontSize: '14@ms',
    },
    iconNameBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // description
    descriptionBox: {
        width: '80%',
        minHeight: '100@vs',
        paddingBottom: '10@vs',
        paddingTop: '5@vs',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderColor: 'white',
        borderRadius: '10@s',
    },
    inputDescription: {
        fontSize: '13@ms',
    },

    // btnSave
    saveBtnView: {
        paddingHorizontal: '60@s',
        marginTop: '60@vs',
    },
});

export default EditProfile;
