import {yupResolver} from '@hookform/resolvers/yup';
import ChangePersonalInfo from 'api/actions/setting/ChangePersonalInfo';
import {GENDER_TYPE, infoType} from 'asset/enum';
import {StyleContainer} from 'components/base';
import StyleDatetimePicker from 'components/base/picker/StyleDatetimePicker';
import StylePicker from 'components/base/picker/StylePicker';
import Redux from 'hook/useRedux';
import {appAlert, appAlertYesNo, goBack} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Zocial from 'react-native-vector-icons/Zocial';
import {
    chooseTextFromIdGender,
    convertToFormatDate,
    isIOS,
    renderListGender,
} from 'utility/assistant';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';
import BoxInfo from './BoxInfo';

const PersonalInformation = () => {
    const {t} = useTranslation();
    /**
     * reset is use for when user don't want to change info as edit
     * see in useEffect
     */
    const {information} = Redux.getPassport();
    const theme = Redux.getTheme();

    const [reset, setReset] = useState(true);

    const inputSchema = yup.object().shape({
        [infoType.facebook]: yupValidate.default(),
        [infoType.email]: yupValidate.email(),
        [infoType.phone]: yupValidate.phone(),
    });
    const form = useForm({
        mode: 'all',
        resolver: yupResolver(inputSchema),
    });
    const {
        setValue,
        getValues,
        formState: {errors},
    } = form;

    /**
     *   FOR PICKER GENDER AND BIRTHDAY
     */
    const [genderPickerVision, setGenderPickerVision] = useState(false);
    const [idGender, setIdGender] = useState(GENDER_TYPE.man);

    const chooseGender = (gender: any) => {
        setIdGender(gender.id);
        setValue(infoType.gender, t(gender.name));
        setGenderPickerVision(false);
    };

    const [temptBirthday, setTemptBirthday] = useState(
        information?.birthday || new Date(2000, 11, 14),
    );
    const [birthdayShow, setBirthdayShow] = useState(false);
    const onChangeDateTimePicker = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate || temptBirthday;
        !isIOS && setBirthdayShow(!birthdayShow);
        setTemptBirthday(currentDate);
        setValue(infoType.birthday, convertToFormatDate(currentDate));
    };

    /**
     * HANDLE WHEN CLICK BUTTON DONE,
     * IF NOT VALID WILL SHOW ALERT, OTHER WILL SHOW AGREE OR NOT
     */
    const [typeChange, setTypeChange] = useState('facebook');

    const agreeChange = (_typeChange: string) => {
        let newInfo: any;
        if (_typeChange === infoType.birthday) {
            newInfo = temptBirthday;
        } else if (_typeChange === infoType.gender) {
            newInfo = idGender;
        } else {
            newInfo = getValues(_typeChange);
        }

        ChangePersonalInfo.changeInfo(newInfo, _typeChange);
        goBack();
    };

    const refuseChange = () => {
        setReset(!reset);
        goBack();
    };

    const openConfirmChange = async (value: string) => {
        await new Promise(resolve => resolve(setTypeChange(value)));
        if (errors[value]) {
            appAlert(errors[value].message);
        } else {
            appAlertYesNo({
                i18Title: 'setting.personalInfo.alertCfChange',
                i18Params: {type: value},
                agreeChange: () => agreeChange(value),
                refuseChange: refuseChange,
            });
        }
    };
    /**
     * -------------------------------------
     */
    useEffect(() => {
        switch (typeChange) {
            case infoType.facebook:
                setValue(infoType.facebook, information?.facebook);
                break;
            case infoType.email:
                setValue(infoType.email, information?.email);
                break;
            case infoType.phone:
                setValue(infoType.phone, information?.phone);
                break;
            case infoType.gender:
                setValue(infoType.gender, information?.gender);
                break;
            case infoType.birthday:
                setValue(infoType.birthday, information?.birthday);
                break;
            default:
                break;
        }
    }, [reset]);

    return (
        <StyleContainer customStyle={styles.container}>
            <FormProvider {...form}>
                <BoxInfo
                    type={infoType.facebook}
                    initValue={information?.facebook}
                    openConfirmChange={() =>
                        openConfirmChange(infoType.facebook)
                    }
                    icon={
                        <Feather
                            name="facebook"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                />

                <BoxInfo
                    type={infoType.email}
                    initValue={information?.email}
                    openConfirmChange={() => openConfirmChange(infoType.email)}
                    icon={
                        <Zocial
                            name="google"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                />

                <BoxInfo
                    type={infoType.phone}
                    initValue={information?.phone}
                    openConfirmChange={() => openConfirmChange(infoType.phone)}
                    icon={
                        <Feather
                            name="phone"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                />

                <BoxInfo
                    type={infoType.gender}
                    initValue={t(chooseTextFromIdGender(information?.gender))}
                    openConfirmChange={() => openConfirmChange(infoType.gender)}
                    setOpenPicker={setGenderPickerVision}
                    icon={
                        <Feather
                            name="user"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                />

                <BoxInfo
                    type={infoType.birthday}
                    initValue={convertToFormatDate(information?.birthday)}
                    openConfirmChange={() =>
                        openConfirmChange(infoType.birthday)
                    }
                    setOpenPicker={setBirthdayShow}
                    icon={
                        <FontAwesome
                            name="birthday-cake"
                            style={[
                                styles.iconBirthday,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />
            </FormProvider>

            {birthdayShow && (
                <StyleDatetimePicker
                    initDate={temptBirthday}
                    mission={onChangeDateTimePicker}
                />
            )}

            {genderPickerVision && (
                <StylePicker
                    dataList={renderListGender}
                    mission={chooseGender}
                    onTouchOut={() => setGenderPickerVision(false)}
                />
            )}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '10@vs',
    },
    icon: {
        fontSize: '25@ms',
    },
    iconBirthday: {
        fontSize: '20@ms',
    },
});

export default PersonalInformation;
