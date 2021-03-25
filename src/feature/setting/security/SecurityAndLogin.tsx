import {typeDetailSetting} from 'asset/name';
import {StyleContainer} from 'components/base';
import TypeDetailSetting from 'feature/setting/components/TypeDetailSetting';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ChangingPassword from './ChangingPassword';
import UserBlocked from './UserBlocked';

/**
 * 1. REQUEST MESSING
 * 2. REQUEST FOLLOW, THIS WILL DEVELOP AFTER
 * 3. CHANGE PASSWORD
 * 4. BLOCK USERS
 */
const SecurityAndLogin = () => {
    // DOING LIKE MESS_SCREEN, HELP NOT WASTE TIME AND RESOURCE
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const openCloseChangingPassword = () => {
        setIsChangingPassword(!isChangingPassword);
    };

    const [isOpeningBlockUser, setIsOpeningBlockUser] = useState(false);
    const openCloseBlockUser = () => {
        setIsOpeningBlockUser(!isOpeningBlockUser);
    };

    return (
        <StyleContainer customStyle={styles.container} scrollEnabled={true}>
            <View style={{alignItems: 'center'}}>
                {/* CHANGE PASSWORD */}
                <TypeDetailSetting
                    onPress={openCloseChangingPassword}
                    type={typeDetailSetting.changePassword}
                />
                {isChangingPassword && <ChangingPassword />}

                {/* BLOCK USER */}
                <TypeDetailSetting
                    onPress={openCloseBlockUser}
                    type={typeDetailSetting.blockUser}
                />
                {isOpeningBlockUser && <UserBlocked />}
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '27@s',
    },
});

export default SecurityAndLogin;
