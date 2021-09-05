import {StyleContainer} from 'components/base';
import TypeDetailSetting from 'components/common/TypeDetailSetting';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import Foundation from 'react-native-vector-icons/Foundation';
import ChangingPassword from './ChangingPassword';
import UserBlocked from './UserBlocked';
import Entypo from 'react-native-vector-icons/Entypo';

const SecurityAndLogin = () => {
    const theme = Redux.getTheme();

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
            {/* CHANGE PASSWORD */}
            <TypeDetailSetting
                title="setting.securityAndLogin.changePass"
                onPress={openCloseChangingPassword}
                icon={
                    <Foundation
                        name="key"
                        style={[styles.stylesIcon, {color: theme.borderColor}]}
                    />
                }
            />
            {isChangingPassword && <ChangingPassword />}

            {/* BLOCK USER */}
            <TypeDetailSetting
                title="setting.securityAndLogin.userBlocked"
                onPress={openCloseBlockUser}
                icon={
                    <Entypo
                        name="block"
                        style={[styles.stylesIcon, {color: theme.borderColor}]}
                    />
                }
            />
            {isOpeningBlockUser && <UserBlocked />}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '27@s',
        alignItems: 'center',
    },
    stylesIcon: {
        fontSize: '25@ms',
    },
});

export default SecurityAndLogin;
