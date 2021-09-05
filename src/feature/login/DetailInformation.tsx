import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import StyleDatetimePicker from 'components/base/picker/StyleDatetimePicker';
import StylePicker from 'components/base/picker/StylePicker';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {convertToFormatDate, isIOS, renderListGender} from 'utility/assistant';

const DetailInformation = () => {
    const {t} = useTranslation();

    const theme = Redux.getTheme();
    const {information} = Redux.getPassport();

    /**
     * HANDLE WHEN CHOOSE BIRTHDAY
     */
    const [temptBirthday, setTemptBirthday] = useState(information?.birthday);
    const [birthdayShow, setBirthdayShow] = useState(false);
    const onChangeDateTimePicker = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate || temptBirthday;
        !isIOS && setBirthdayShow(!birthdayShow);
        setTemptBirthday(currentDate);
    };

    /**
     * HANDLE WHEN SELECTING GENDER
     */
    const [genderPickerVision, setGenderPickerVision] = useState(false);
    const listGender = renderListGender.map(item => t(item.text));
    const [idGender, setIdGender] = useState(renderListGender[1].id);
    const [gender, setGender] = useState(listGender[1]);

    const chooseGender = (value: string, index: number) => {
        setIdGender(renderListGender[index].id);
        setGender(value);
        setGenderPickerVision(false);
    };

    /**
     * CONFIRM SAVE TO ASYNC OR NOT
     */
    const [isOpenChoose, setIsOpenChoose] = useState(false);

    const checkConditionToGoMainScreen = async () => {
        setIsOpenChoose(true);
    };

    return (
        <StyleContainer customStyle={styles.container}>
            {/* TITLE HEADER */}
            <StyleText
                i18Text="login.detailInformation.noti"
                customStyle={[styles.titleContent, {color: theme.borderColor}]}
            />

            {/* GENDER CHOOSE */}
            <View style={styles.boxInput}>
                <View
                    style={[
                        styles.genderBox,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    <StyleText
                        originValue={gender}
                        customStyle={[
                            styles.text_iconGender,
                            {color: theme.textColor},
                        ]}
                    />
                    <StyleTouchable
                        customStyle={styles.touchChooseGender}
                        onPress={() => setGenderPickerVision(true)}>
                        <AntDesign
                            name="caretdown"
                            style={[
                                styles.text_iconGender,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </View>

            {/* BIRTHDAY USER */}
            <View style={styles.boxInput}>
                <View
                    style={[
                        styles.birthdayBox,
                        {borderBottomColor: theme.borderColor},
                    ]}>
                    <StyleInput
                        inputStyle={styles.inputBirthday}
                        editable={false}
                        hasUnderLine={false}
                        hasErrorBox={false}
                        value={convertToFormatDate(temptBirthday)}
                        placeholderTextColor={theme.holderColor}
                    />
                    <StyleTouchable
                        customStyle={styles.touchIconBirthday}
                        onPress={() => setBirthdayShow(!birthdayShow)}>
                        <Ionicons
                            name="calendar"
                            style={[
                                styles.iconBirthday,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </View>

            {birthdayShow && (
                <StyleDatetimePicker
                    initDate={temptBirthday || new Date(2000, 11, 14)}
                    mission={onChangeDateTimePicker}
                />
            )}

            {/* BUTTON COMPLETE REGISTER */}
            <StyleButton
                title="login.detailInformation.done"
                containerStyle={[
                    styles.buttonLetGo,
                    {borderColor: theme.borderColor},
                ]}
                onPress={checkConditionToGoMainScreen}
            />

            {genderPickerVision && (
                <StylePicker
                    dataList={listGender}
                    mission={chooseGender}
                    onTouchOut={() => setGenderPickerVision(false)}
                />
            )}

            {/* {isOpenChoose && (
                <AlertYesOrNo
                    i18Content="alert.wantToSave"
                    agreeChange={() => null}
                    refuseChange={() => null}
                />
            )} */}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    // title content
    titleContent: {
        fontSize: 20,
        fontStyle: 'italic',
        marginTop: '15@vs',
    },
    boxInput: {
        width: '70%',
        alignItems: 'center',
        marginTop: '5%',
    },
    // gender choose
    genderBox: {
        width: '80%',
        borderBottomWidth: 1,
        marginVertical: '5@vs',
        padding: '5@vs',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_iconGender: {
        fontSize: 20,
    },
    touchChooseGender: {
        position: 'absolute',
        right: '2%',
    },
    // birthday choose
    birthdayBox: {
        width: '90%',
        borderBottomWidth: 1,
        marginVertical: '5@vs',
        padding: '5@vs',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBirthday: {
        fontSize: 20,
        textAlign: 'center',
    },
    touchIconBirthday: {
        position: 'absolute',
        right: '5%',
    },
    iconBirthday: {
        fontSize: 25,
    },
    // button let's go
    buttonLetGo: {
        marginTop: '50@vs',
        paddingHorizontal: '40@vs',
    },
    textButtonLetGo: {
        fontSize: 25,
    },
});

export default DetailInformation;
