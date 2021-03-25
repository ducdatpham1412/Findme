import {typeDetailSetting} from 'asset/name';
import {StyleText} from 'components/base';
import useRedux from 'hook/useRedux';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IconRight = (props: any) => {
    const theme = props.theme;

    const stylesIcon = {
        fontSize: moderateScale(25),
        color: theme.borderColor,
    };
    let icon;
    switch (props.type) {
        case 'changePassword':
            icon = <Foundation name="key" style={stylesIcon} />;
            break;
        case 'blockUser':
            icon = <Entypo name="block" style={stylesIcon} />;
            break;
        case 'theme':
            icon = <Ionicons name="color-palette-outline" style={stylesIcon} />;
            break;
        case 'language':
            icon = <FontAwesome name="language" style={stylesIcon} />;
            break;
        default:
            break;
    }

    return <View style={styles.iconView}>{icon}</View>;
};

/**
 *  BOSS HERE
 *  CURRENTLY HAVING 4 TYPES: changePassword, blockUser, theme and language
 */
interface TypeDetailSettingProps {
    type: string;
    onPress?(): void;
}

const TypeDetailSetting = (props: TypeDetailSettingProps) => {
    const Redux = useRedux();

    const theme = Redux.getTheme();
    const {type, onPress} = props;

    let name;
    switch (type) {
        case typeDetailSetting.changePassword:
            name = 'setting.component.typeDetailSetting.changePass';
            break;
        case typeDetailSetting.blockUser:
            name = 'setting.component.typeDetailSetting.userBlocked';
            break;
        case typeDetailSetting.theme:
            name = 'setting.component.typeDetailSetting.theme';
            break;
        case typeDetailSetting.language:
            name = 'setting.component.typeDetailSetting.language';
            break;
        default:
            break;
    }

    return (
        <TouchableOpacity
            style={[
                styles.frameBorderBottomSetting,
                {borderColor: theme.borderColor},
            ]}
            onPress={onPress}>
            <StyleText
                i18Text={name}
                customStyle={[styles.textHeader, {color: theme.textColor}]}
            />
            <IconRight theme={theme} type={type} />
        </TouchableOpacity>
    );
};

const styles = ScaledSheet.create({
    frameBorderBottomSetting: {
        width: '100%',
        borderBottomWidth: 1,
        paddingVertical: '8@vs',
        paddingHorizontal: '10@s',
        marginVertical: '17@vs',
        justifyContent: 'center',
    },
    textHeader: {
        fontSize: '18@ms',
    },
    iconView: {
        position: 'absolute',
        right: '25@s',
    },
});

export default TypeDetailSetting;
