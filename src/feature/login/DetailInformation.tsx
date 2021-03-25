import Register, {accountType} from 'api/actions/login/Register';
import AlertYesOrNo from 'components/AlertYesOrNo';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import StyleDatetimePicker from 'components/base/picker/StyleDatetimePicker';
import StylePicker from 'components/base/picker/StylePicker';
import useRedux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {convertToFormatDate} from 'utility/convert';

/**
 * WHEN CLICK TO BUTTON 'DONE', IT SWITCH TO MAIN_SCREEN
 * ASSEMBLE SET FOR ASYNC STORAGE "LOGGED" TRUE
 */
const win = Dimensions.get('screen').width;

const DetailInformation = () => {
    const Redux = useRedux();
    const {t, i18n} = useTranslation();

    const theme = Redux.getTheme();
    const {username, password} = Redux.getLogin();
    const {contact} = Redux.getProfileOutCpn();

    const [gender, setGender] = useState(
        i18n.language === 'en' ? 'Woman' : 'Nữ',
    );
    // Redux.updateProfile({info: {gender}});

    const [temptName, setTemptName] = useState('');

    /**
     * HANDLE WHEN CHOOSE BIRTHDAY
     */
    const [temptBirthday, setTemptBirthday] = useState(
        Redux.getProfile().info?.birthday,
    );
    const [birthdayShow, setBirthdayShow] = useState(false);
    const onChangeDateTimePicker = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate || temptBirthday;
        Platform.OS !== 'ios' && setBirthdayShow(!birthdayShow);
        setTemptBirthday(currentDate);
    };

    const account: accountType = {
        // login
        username,
        password,
        // info
        name: temptName,
        gender: gender,
        birthday: temptBirthday || new Date(2000, 11, 14),
        // contact
        facebook: contact?.facebook,
        email: contact?.email || '',
        phone: contact?.phone || '',
    };

    /**
     * HANDLE WHEN SELECTING GENDER
     */
    const listGender = t('login.detailInformation.listGender').split(',');
    const [genderPickerVision, setGenderPickerVision] = useState(false);

    const chooseGender = (value: string) => {
        // console.log(gender);
        setGender(value);
        setGenderPickerVision(false);
    };

    /**
     * CONFIRM TO GO THE MAIN_SCREEN
     */
    const [isOpenChoose, setIsOpenChoose] = useState(false);

    const agreeRememberAcc = () => Register.register(account, true);
    const refuseRemAcc = () => Register.register(account, false);

    const checkConditionToGoMainScreen = async () => {
        if (temptName === '') {
            appAlert('alert.notNull');
            return;
        } else {
            setIsOpenChoose(true);
        }
    };

    return (
        <StyleContainer customStyle={styles.container}>
            {/* TITLE HEADER */}
            <StyleText
                i18Text="login.detailInformation.noti"
                customStyle={[styles.titleContent, {color: theme.borderColor}]}
            />

            {/* PROFILE AVATAR */}
            <View
                style={[styles.avatarBox, {borderColor: theme.borderColor}]}
            />

            {/* FIND_ME NAME */}
            <StyleInput
                i18Placeholder="login.detailInformation.nameHolder"
                onChangeText={value => setTemptName(value)}
                containerStyle={styles.boxName}
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

            {/* BUTTON GO TO MAINLOGIN */}
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

            {isOpenChoose && (
                <AlertYesOrNo
                    i18Content="alert.wantToSave"
                    agreeChange={agreeRememberAcc}
                    refuseChange={refuseRemAcc}
                />
            )}
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
    // avatar box
    avatarBox: {
        width: win / 3,
        height: win / 3,
        borderWidth: 2,
        marginTop: '10%',
        borderRadius: win / 2,
    },
    // box input name
    boxName: {
        width: '60%',
        marginTop: '10%',
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
