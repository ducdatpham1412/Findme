import {infoType} from 'asset/name';
import {StyleInputForm, StyleTouchable} from 'components/base';
import useRedux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Zocial from 'react-native-vector-icons/Zocial';

interface BoxInfoProps {
    type: string;
    initValue: any;
    openConfirmChange: any;
    setOpenPicker?: any;
}

const BoxInfo = (props: BoxInfoProps) => {
    const Redux = useRedux();

    const {t} = useTranslation();
    const theme = Redux.getTheme();
    const {type, initValue, openConfirmChange, setOpenPicker} = props;
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<any>(null);

    const keyboardType =
        type === infoType.phone
            ? 'numeric'
            : type === infoType.email
            ? 'email-address'
            : 'default';

    /**
     * SELECT ICON LEFT
     */
    let icon: any;
    const styleIcon = {
        fontSize: 25,
        color: theme.borderColor,
    };
    switch (type) {
        case 'facebook':
            icon = <Feather name="facebook" style={styleIcon} />;
            break;
        case 'email':
            icon = <Zocial name="google" style={styleIcon} />;
            break;
        case 'phone':
            icon = <Feather name="phone" style={styleIcon} />;
            break;
        case 'gender':
            icon = <Feather name="user" style={styleIcon} />;
            break;
        case 'birthday':
            icon = <FontAwesome name="birthday-cake" style={styleIcon} />;
            break;
        default:
            break;
    }
    /**
     * ASSIGN FUNCTION
     */
    const openCloseEditable = () => {
        if (!editable) {
            inputRef.current.focus();
            setOpenPicker && setOpenPicker(true);
        } else if (editable) {
            setOpenPicker && setOpenPicker(false);
            openConfirmChange();
        }
        setEditable(!editable);
    };

    return (
        <View style={[styles.moduleInfo, {borderColor: theme.borderColor}]}>
            {/* ICON */}
            <View style={styles.iconModule}>{icon}</View>

            {/* INFO FOR INPUT */}

            {[infoType.facebook, infoType.email, infoType.phone].includes(
                type,
            ) && (
                <StyleInputForm
                    ref={inputRef}
                    name={type}
                    containerStyle={styles.contentBox}
                    inputStyle={styles.inputInfo}
                    hasErrorBox={false}
                    defaultValue={initValue}
                    placeholder={initValue || t('setting.personalInfo.notYet')}
                    editable={editable}
                    keyboardType={keyboardType}
                />
            )}

            {type === infoType.gender && (
                <StyleInputForm
                    ref={inputRef}
                    name={type}
                    hasErrorBox={false}
                    containerStyle={styles.contentBox}
                    inputStyle={styles.inputInfo}
                    defaultValue={initValue}
                    placeholder={initValue || t('setting.personalInfo.notYet')}
                    editable={false}
                />
            )}

            {type === infoType.birthday && (
                <StyleInputForm
                    ref={inputRef}
                    name={type}
                    hasErrorBox={false}
                    containerStyle={styles.contentBox}
                    inputStyle={styles.inputInfo}
                    defaultValue={initValue}
                    editable={false}
                />
            )}

            {/* ICON BUTTON EDIT */}
            <StyleTouchable
                customStyle={styles.iconModule}
                onPress={openCloseEditable}>
                {editable ? (
                    <AntDesign
                        name="check"
                        style={[
                            styles.ic_edit_check,
                            {color: theme.borderColor},
                        ]}
                    />
                ) : (
                    <AntDesign
                        name="edit"
                        style={[
                            styles.ic_edit_check,
                            {color: theme.borderColor},
                        ]}
                    />
                )}
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    moduleInfo: {
        width: '100%',
        height: 70,
        borderWidth: 1,
        borderRadius: 15,
        flexDirection: 'row',
        marginVertical: 10,
    },
    iconModule: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'orange'
    },
    // content
    contentBox: {
        flex: 6,
        overflow: 'scroll',
    },
    inputInfo: {
        fontSize: 20,
        borderBottomWidth: 0,
        paddingVertical: 0,
        paddingHorizontal: '5@vs',
        textAlign: 'left',
    },
    // icon edit - check
    ic_edit_check: {
        fontSize: 25,
    },
});

export default BoxInfo;
