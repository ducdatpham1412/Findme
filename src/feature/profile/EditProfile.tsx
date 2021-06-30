/*eslint-disable react-native/no-inline-styles */
import UpdateProfile from 'api/actions/setting/UpdateProfile';
import {StyleButton, StyleContainer, StyleInput} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useState} from 'react';
import {Dimensions, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {logger} from 'utility/assistant';
import AvatarElement from './components/AvatarElement';
import BtnPenEdit from './components/BtnPenEdit';
import CoverElement from './components/CoverElement';

const {width} = Dimensions.get('screen');

const CoverEdit = ({cover, setCover}: any) => {
    return (
        <View style={styles.coverBox}>
            <CoverElement cover={cover} customStyle={{flex: 1}} />
            <BtnPenEdit
                btnStyle={styles.buttonEditCover}
                onPress={() => logger('selecting cover')}
            />
        </View>
    );
};

const AvatarEdit = ({avatar, setAvatar}: any) => {
    return (
        <View style={styles.avatarBox}>
            <AvatarElement
                avatar={avatar}
                customStyle={styles.avatar}
                imageStyle={styles.avatarImg}
            />
            <BtnPenEdit
                btnStyle={styles.btnEditAvatar}
                onPress={() => logger('selecting avatar')}
            />
        </View>
    );
};

const NameEdit = ({name, setName}: any) => {
    return (
        <View style={styles.nameBox}>
            <StyleInput
                value={name}
                i18Placeholder="login.detailInformation.nameHolder"
                onChangeText={value => setName(value)}
                inputStyle={styles.inputName}
            />
        </View>
    );
};

const DescriptionEdit = ({description, setDescription}: any) => {
    const theme = useRedux().getTheme();

    return (
        <View style={[styles.descriptionBox, {borderColor: theme.borderColor}]}>
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
    );
};

const BtnSaveChange = ({onSaveChange}: any) => {
    return (
        <StyleButton
            title="profile.edit.confirmButton"
            titleStyle={styles.titleBtn}
            containerStyle={styles.saveBtnView}
            onPress={onSaveChange}
        />
    );
};

/**
 * EDIT PROFILE
 */
const EditProfile = () => {
    const {info} = useRedux().getProfile();

    const [cover, setCover] = useState(info?.cover);
    const [avatar, setAvatar] = useState(info?.avatar);
    const [name, setName] = useState(info?.name);
    const [description, setDescription] = useState(info?.description);

    const onSaveChange = async () => {
        await UpdateProfile.updateProfile({
            info: {name, avatar, cover, description},
        });
    };

    return (
        <StyleContainer scrollEnabled customStyle={{alignItems: 'center'}}>
            <CoverEdit cover={cover} setCover={setCover} />

            <AvatarEdit avatar={avatar} setAvatar={setAvatar} />

            <NameEdit name={name} setName={setName} />

            <DescriptionEdit
                description={description}
                setDescription={setDescription}
            />

            <BtnSaveChange onSaveChange={onSaveChange} />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    // cover
    coverBox: {
        width: '100%',
        height: width / 2.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonEditCover: {
        position: 'absolute',
        width: '90@s',
        height: '35@s',
        borderRadius: '20@s',
    },

    // avatar
    avatarBox: {
        width: width / 2.8,
        height: width / 2.8,
        marginTop: '-20@vs',
        overflow: 'hidden',
        borderRadius: width / 2,
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: 'lightgreen',
        borderRadius: '200@vs',
        borderWidth: 4,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '200@vs',
    },
    btnEditAvatar: {
        position: 'absolute',
        width: width / 2.8,
        height: '23@vs',
        bottom: 0,
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
