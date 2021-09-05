import UpdateProfile from 'api/actions/setting/UpdateProfile';
import {Metrics} from 'asset/metrics';
import {AVATAR_SIZE, COVER_SIZE} from 'asset/standardValue';
import {StyleButton, StyleContainer, StyleInput} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {ScaledSheet} from 'react-native-size-matters';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    optionsImagePicker,
} from 'utility/assistant';
import AvatarElement from './components/AvatarElement';
import BtnPenEdit from './components/BtnPenEdit';
import CoverElement from './components/CoverElement';

// COVER
const CoverEdit = ({cover, setCover}: any) => {
    const actionRef = useRef<any>(null);
    const {t} = useTranslation();
    const optionsImgPicker = optionsImagePicker.map(item => t(item));

    const chooseAction = (index: number) => {
        if (index === 0) {
            chooseImageFromCamera(setCover, {
                maxWidth: COVER_SIZE.width,
                maxHeight: COVER_SIZE.height,
            });
        } else if (index === 1) {
            chooseImageFromLibrary(setCover, {
                maxWidth: COVER_SIZE.width,
                maxHeight: COVER_SIZE.height,
            });
        }
    };

    return (
        <View style={styles.coverBox}>
            <CoverElement cover={cover} customStyle={{flex: 1}} />
            <BtnPenEdit
                btnStyle={styles.buttonEditCover}
                onPress={() => actionRef.current.show()}
            />

            <ActionSheet
                ref={actionRef}
                options={optionsImgPicker}
                cancelButtonIndex={2}
                onPress={chooseAction}
            />
        </View>
    );
};

// AVATAR
const AvatarEdit = ({avatar, setAvatar}: any) => {
    const actionRef = useRef<any>(null);
    const {t} = useTranslation();
    const optionsImgPicker = optionsImagePicker.map(item => t(item));

    const chooseAction = (index: number) => {
        if (index === 0) {
            chooseImageFromCamera(setAvatar, {
                maxWidth: AVATAR_SIZE.width,
                maxHeight: AVATAR_SIZE.height,
            });
        } else if (index === 1) {
            chooseImageFromLibrary(setAvatar, {
                maxWidth: AVATAR_SIZE.width,
                maxHeight: AVATAR_SIZE.height,
            });
        }
    };

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

            <ActionSheet
                ref={actionRef}
                options={optionsImgPicker}
                cancelButtonIndex={2}
                onPress={chooseAction}
            />
        </View>
    );
};

/**
 * EDIT PROFILE
 */
const EditProfile = () => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();

    const [cover, setCover] = useState(profile?.cover);
    const [avatar, setAvatar] = useState(profile?.avatar);
    const [name, setName] = useState(profile?.name);
    const [description, setDescription] = useState(profile?.description);

    const onSaveChange = async () => {
        await UpdateProfile.updatePassport({
            profile: {name, description, avatar, cover},
        });
    };

    return (
        <StyleContainer scrollEnabled customStyle={styles.container}>
            <CoverEdit cover={cover} setCover={setCover} />

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
            <View
                style={[
                    styles.descriptionBox,
                    {borderColor: theme.borderColor},
                ]}>
                <StyleInput
                    value={description}
                    i18Placeholder="About me"
                    multiline
                    onChangeText={value => setDescription(value)}
                    containerStyle={{width: '100%'}}
                    inputStyle={styles.inputDescription}
                    hasUnderLine={false}
                    hasErrorBox={false}
                />
            </View>

            {/* Button update */}
            <StyleButton
                title="profile.edit.confirmButton"
                titleStyle={styles.titleBtn}
                containerStyle={styles.saveBtnView}
                onPress={onSaveChange}
            />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: '200@vs',
    },
    // cover
    coverBox: {
        width: '100%',
        height: Metrics.width / 2.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonEditCover: {
        left: '10@s',
        bottom: '10@s',
    },

    // avatar
    avatarBox: {
        width: Metrics.width / 2.8,
        height: Metrics.width / 2.8,
        marginTop: '-20@vs',
        borderRadius: Metrics.width / 2,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '200@vs',
        borderWidth: 4,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '200@vs',
    },
    btnEditAvatar: {
        width: '27@s',
        height: '27@s',
        bottom: '5@s',
        left: '9@s',
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
        paddingBottom: '10@vs',
        paddingTop: '5@vs',
        borderWidth: 0.5,
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
    titleBtn: {
        fontSize: '17@ms',
    },
});

export default EditProfile;
