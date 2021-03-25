/* eslint-disable react-native/no-inline-styles */
import useRedux from 'hook/useRedux';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IconLeft = (props: any) => {
    const theme = useRedux().getTheme();

    const iconLeftStyle = {
        fontSize: 20,
        color: theme.borderColor,
    };

    let iconLeft;
    switch (props.type) {
        case 'security':
            iconLeft = <FontAwesome name="shield" style={iconLeftStyle} />;
            break;
        case 'personalInfo':
            iconLeft = <FontAwesome name="user-o" style={iconLeftStyle} />;
            break;
        case 'extend':
            iconLeft = <MaterialIcons name="extension" style={iconLeftStyle} />;
            break;
        case 'aboutFindme':
            iconLeft = <FontAwesome name="info" style={iconLeftStyle} />;
            break;
        case 'logOut':
            iconLeft = (
                <Ionicons name="navigate-outline" style={iconLeftStyle} />
            );
            break;
        default:
            iconLeft = <View />;
            break;
    }
    return (
        <View style={{width: moderateScale(50), alignItems: 'center'}}>
            {iconLeft}
        </View>
    );
};

/**
 * BOSS HERE
 */

interface TypeMainSettingProps {
    type: string;
    onPress(): void;
}

const TypeMainSetting = (props: TypeMainSettingProps) => {
    const theme = useRedux().getTheme();
    const {t} = useTranslation();

    let name;
    const setName = () => {
        switch (props.type) {
            case 'security':
                name = t('setting.component.typeMainSetting.security');
                break;
            case 'personalInfo':
                name = t('setting.component.typeMainSetting.personalInfo');
                break;
            case 'extend':
                name = t('setting.component.typeMainSetting.extend');
                break;
            case 'aboutFindme':
                name = t('setting.component.typeMainSetting.aboutFindme');
                break;
            case 'logOut':
                name = t('setting.component.typeMainSetting.logOut');
                break;
            default:
                break;
        }
    };
    setName();

    return (
        <View
            style={[styles.container, {borderBottomColor: theme.borderColor}]}>
            <TouchableOpacity style={styles.buttonBox} onPress={props.onPress}>
                <IconLeft type={props.type} />
                <Text style={[styles.text, {color: theme.textColor}]}>
                    {name}
                </Text>
                <Entypo
                    name="chevron-right"
                    style={[styles.iconRight, {color: theme.textColor}]}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        borderBottomWidth: 1,
        paddingVertical: '12@vs',
        paddingRight: '15@s',
        marginVertical: '8@vs',
    },
    buttonBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: '20@ms',
    },
    iconRight: {
        fontSize: '20@ms',
        position: 'absolute',
        right: 0,
    },
});

export default TypeMainSetting;
