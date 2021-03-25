/* eslint-disable react-hooks/exhaustive-deps */
import {yupResolver} from '@hookform/resolvers/yup';
import ChangePersonalInfo from 'api/actions/setting/ChangePersonalInfo';
import {infoType} from 'asset/name';
import AlertYesOrNo from 'components/AlertYesOrNo';
import {StyleContainer} from 'components/base';
import StyleDatetimePicker from 'components/base/picker/StyleDatetimePicker';
import StylePicker from 'components/base/picker/StylePicker';
import useRedux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Platform, ScrollView} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {convertToFormatDate} from 'utility/convert';
import {yupEmail, yupNoName, yupPhone} from 'utility/yupSchema';
import * as yup from 'yup';
import BoxInfo from './BoxInfo';

const PersonalInformation = () => {
    const Redux = useRedux();

    const {t} = useTranslation();
    /**
     * reset is use for when user don't want to change info as edit
     * see in useEffect
     */
    const [reset, setReset] = useState(true);

    const initInfo = Redux.getProfile();
    const {info, contact} = initInfo;

    const inputSchema = yup.object().shape({
        [infoType.facebook]: yupNoName(),
        [infoType.email]: yupEmail(),
        [infoType.phone]: yupPhone(),
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
    const listGender = t('login.detailInformation.listGender').split(',');
    const chooseGender = (gender: string) => {
        setValue(infoType.gender, gender);
        setGenderPickerVision(false);
    };

    const [temptBirthday, setTemptBirthday] = useState(
        info?.birthday || new Date(2000, 11, 14),
    );
    const [birthdayShow, setBirthdayShow] = useState(false);
    const onChangeDateTimePicker = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate || temptBirthday;
        Platform.OS !== 'ios' && setBirthdayShow(!birthdayShow);
        setTemptBirthday(currentDate);
        setValue(infoType.birthday, convertToFormatDate(currentDate));
    };

    /**
     * HANDLE WHEN CLICK BUTTON DONE,
     * IF NOT VALID WILL SHOW ALERT, OTHER WILL SHOW AGREE OR NOT
     */
    const [isOpeningCfChange, setIsOpeningCfChange] = useState(false);
    const [typeChange, setTypeChange] = useState('facebook');

    const openConfirmChange = (value: string) => {
        setTypeChange(value);
        if (errors[value]) {
            appAlert(errors[value].message);
        } else {
            setIsOpeningCfChange(true);
        }
    };

    const agreeChange = () => {
        const newInfo =
            typeChange === infoType.birthday
                ? temptBirthday
                : getValues(typeChange);
        // change in async, redux and server
        ChangePersonalInfo.changeInfo(newInfo, typeChange);
        setIsOpeningCfChange(false);
    };

    const refuseChange = () => {
        setReset(!reset);
        setIsOpeningCfChange(false);
    };
    /**
     * -------------------------------------
     */
    useEffect(() => {
        switch (typeChange) {
            case infoType.facebook:
                setValue(infoType.facebook, contact?.facebook);
                break;
            case infoType.email:
                setValue(infoType.email, contact?.email);
                break;
            case infoType.phone:
                setValue(infoType.phone, contact?.phone);
                break;
            case infoType.gender:
                setValue(infoType.gender, info?.gender);
                break;
            case infoType.birthday:
                setValue(infoType.birthday, info?.birthday);
                break;
            default:
                break;
        }
        // console.log(initInfo);
    }, [reset]);

    return (
        <StyleContainer customStyle={styles.container}>
            <ScrollView>
                <FormProvider {...form}>
                    <BoxInfo
                        type={infoType.facebook}
                        initValue={contact?.facebook}
                        openConfirmChange={() =>
                            openConfirmChange(infoType.facebook)
                        }
                    />

                    <BoxInfo
                        type={infoType.email}
                        initValue={contact?.email}
                        openConfirmChange={() =>
                            openConfirmChange(infoType.email)
                        }
                    />

                    <BoxInfo
                        type={infoType.phone}
                        initValue={contact?.phone}
                        openConfirmChange={() =>
                            openConfirmChange(infoType.phone)
                        }
                    />

                    <BoxInfo
                        type={infoType.gender}
                        initValue={info?.gender}
                        openConfirmChange={() =>
                            openConfirmChange(infoType.gender)
                        }
                        setOpenPicker={setGenderPickerVision}
                    />

                    <BoxInfo
                        type={infoType.birthday}
                        initValue={convertToFormatDate(info?.birthday)}
                        openConfirmChange={() =>
                            openConfirmChange(infoType.birthday)
                        }
                        setOpenPicker={setBirthdayShow}
                    />
                </FormProvider>

                {birthdayShow && (
                    <StyleDatetimePicker
                        initDate={temptBirthday}
                        mission={onChangeDateTimePicker}
                    />
                )}
            </ScrollView>

            {genderPickerVision && (
                <StylePicker
                    dataList={listGender}
                    mission={chooseGender}
                    onTouchOut={() => setGenderPickerVision(false)}
                />
            )}

            {isOpeningCfChange && (
                <AlertYesOrNo
                    i18Content="setting.personalInfo.alertCfChange"
                    i18ContentParams={{type: typeChange}}
                    agreeChange={agreeChange}
                    refuseChange={refuseChange}
                />
            )}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '10@vs',
    },
});

export default PersonalInformation;
