import {infoType} from 'asset/enum';
import {StyleInputForm, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface BoxInfoProps {
    type: any;
    initValue: any;
    openConfirmChange: any;
    setOpenPicker?: any;
    icon: ReactNode;
}

const BoxInfo = (props: BoxInfoProps) => {
    const {type, initValue, openConfirmChange, setOpenPicker, icon} = props;
    const {t} = useTranslation();
    const theme = Redux.getTheme();

    const inputRef = useRef<any>(null);
    const [editable, setEditable] = useState(false);

    const keyboardType =
        type === infoType.phone
            ? 'numeric'
            : type === infoType.email
            ? 'email-address'
            : 'default';

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
        height: '50@vs',
        borderWidth: 1,
        borderRadius: '10@vs',
        flexDirection: 'row',
        marginVertical: '7@vs',
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
        fontSize: '17@ms',
        paddingHorizontal: '5@vs',
        textAlign: 'left',
    },
    // icon edit - check
    ic_edit_check: {
        fontSize: '20@ms',
    },
});

export default BoxInfo;
