/*eslint-disable react-native/no-inline-styles */
import {StyleContainer, StyleInput} from 'components/base';
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
                imageStyle={{width: '100%', height: '100%'}}
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
                containerStyle={styles.inputNameView}
            />
        </View>
    );
};

const DescriptionEdit = ({description, setDescription}: any) => {
    return <View />;
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

    return (
        <StyleContainer scrollEnabled>
            <CoverEdit cover={cover} setCover={setCover} />

            <AvatarEdit avatar={avatar} setAvatar={setAvatar} />

            <NameEdit name={name} setName={setName} />

            <DescriptionEdit
                description={description}
                setDescription={setDescription}
            />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
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
        alignSelf: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: 'lightgreen',
        borderRadius: width / 2,
    },
    btnEditAvatar: {
        position: 'absolute',
        width: width / 2.8,
        height: '30@vs',
        bottom: 0,
    },

    // name
    nameBox: {
        height: '50@vs',
        width: '60%',
        marginTop: '40@vs',
        alignSelf: 'center',
    },
    inputNameView: {},
    iconNameBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EditProfile;
