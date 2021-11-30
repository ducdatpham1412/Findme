import {apiEditProfile} from 'api/module';
import FindmeStore from 'app-redux/store';
import {Metrics} from 'asset/metrics';
import {AVATAR_SIZE, COVER_SIZE} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleTouchable,
} from 'components/base';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Redux from 'hook/useRedux';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {memo, useMemo, useRef, useState} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {chooseImageFromCamera, chooseImageFromLibrary} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';
import AvatarElement from './components/AvatarElement';
import BtnPenEdit from './components/BtnPenEdit';
import CoverElement from './components/CoverElement';

// Cover
const CoverEdit = memo(({cover, setCover}: any) => {
    const actionRef = useRef<any>(null);

    const listTextAndOption = useMemo(() => {
        return [
            {
                text: 'common.chooseFromCamera',
                action: async () =>
                    await chooseImageFromCamera(setCover, {
                        maxWidth: COVER_SIZE.width,
                        maxHeight: COVER_SIZE.height,
                    }),
            },
            {
                text: 'common.chooseFromLibrary',
                action: async () =>
                    await chooseImageFromLibrary(setCover, {
                        maxWidth: COVER_SIZE.width,
                        maxHeight: COVER_SIZE.height,
                    }),
            },
            {
                text: 'common.cancel',
                action: () => null,
            },
        ];
    }, [cover]);

    return (
        <View style={styles.coverBox}>
            <CoverElement cover={cover} customStyle={{flex: 1}} />
            <BtnPenEdit
                btnStyle={styles.buttonEditCover}
                onPress={() => actionRef.current.show()}
            />

            <StyleActionSheet
                ref={actionRef}
                listTextAndAction={listTextAndOption}
            />
        </View>
    );
});

// Avatar
const AvatarEdit = memo(({avatar, setAvatar}: any) => {
    const actionRef = useRef<any>(null);

    const listTextAndOption = useMemo(() => {
        return [
            {
                text: 'common.chooseFromCamera',
                action: async () =>
                    await chooseImageFromCamera(setAvatar, {
                        maxWidth: AVATAR_SIZE.width,
                        maxHeight: AVATAR_SIZE.height,
                    }),
            },
            {
                text: 'common.chooseFromLibrary',
                action: async () =>
                    await chooseImageFromLibrary(setAvatar, {
                        maxWidth: AVATAR_SIZE.width,
                        maxHeight: AVATAR_SIZE.height,
                    }),
            },
            {
                text: 'common.cancel',
                action: () => null,
            },
        ];
    }, [avatar]);

    return (
        <View style={styles.avatarBox}>
            <AvatarElement
                avatar={avatar}
                customStyle={styles.avatar}
                imageStyle={styles.avatarImg}
            />
            <BtnPenEdit
                btnStyle={styles.btnEditAvatar}
                onPress={() => actionRef.current.show()}
            />

            <StyleActionSheet
                ref={actionRef}
                listTextAndAction={listTextAndOption}
            />
        </View>
    );
});

/**
 * Edit profile
 */
const EditProfile = () => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();

    const inputDescriptionRef = useRef<TextInput>(null);
    const [avatar, setAvatar] = useState(profile?.avatar);
    const [cover, setCover] = useState(profile?.cover);
    const [name, setName] = useState(profile?.name);
    const [description, setDescription] = useState(profile?.description);

    const disableButton =
        avatar === profile.avatar &&
        cover === profile.cover &&
        name === profile.name &&
        description === profile.description;

    const onSaveChange = async () => {
        try {
            Redux.setIsLoading(true);
            const modeExp = FindmeStore.getState().accountSlice.modeExp;
            // update in server
            if (!modeExp) {
                const newAvatar =
                    avatar === profile.avatar
                        ? undefined
                        : await ImageUploader.upLoad(avatar, 1000);
                const newCover =
                    cover === profile.cover
                        ? undefined
                        : await ImageUploader.upLoad(cover, 600);
                const newName = name === profile.name ? undefined : name;
                const newDescription =
                    description === profile.description
                        ? undefined
                        : description;

                await apiEditProfile({
                    avatar: newAvatar,
                    cover: newCover,
                    name: newName,
                    description: newDescription,
                });
            }

            // update in local
            Redux.updatePassport({profile: {avatar, cover, name, description}});

            // alert success and comeback
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
        <StyleContainer scrollEnabled customStyle={styles.container}>
            {/* <CoverEdit cover={cover} setCover={setCover} /> */}

            <AvatarEdit avatar={avatar} setAvatar={setAvatar} />

            {/* Name */}
            <View style={styles.nameBox}>
                <StyleInput
                    value={name}
                    i18Placeholder="login.detailInformation.nameHolder"
                    onChangeText={value => setName(value)}
                    inputStyle={styles.inputName}
                />
            </View>

            {/* Description */}
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

            {/* Button update */}
            <StyleButton
                title="profile.edit.confirmButton"
                containerStyle={styles.saveBtnView}
                onPress={onSaveChange}
                disable={disableButton}
            />

            <View style={{height: verticalScale(200)}} />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    // cover
    coverBox: {
        width: '100%',
        height: Metrics.width / 2.8,
    },
    buttonEditCover: {
        left: '10@s',
        bottom: '10@s',
    },

    // avatar
    avatarBox: {
        width: Metrics.width / 1.3,
        height: Metrics.width / 1.3,
        marginTop: '10@ms',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderWidth: '2@ms',
        borderRadius: '25@vs',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '20@vs',
    },
    btnEditAvatar: {
        width: '27@s',
        height: '27@s',
        bottom: '10@s',
        left: '15@s',
    },

    // name
    nameBox: {
        height: '50@vs',
        width: '60%',
        marginTop: '40@vs',
        alignSelf: 'center',
    },
    inputName: {
        fontSize: '20@ms',
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
        marginTop: '15@vs',
    },
    inputDescription: {
        fontSize: '17@ms',
    },

    // btnSave
    saveBtnView: {
        paddingHorizontal: '60@s',
        marginTop: '60@vs',
    },
});

export default EditProfile;
