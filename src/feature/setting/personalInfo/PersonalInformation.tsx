/* eslint-disable no-underscore-dangle */
import {yupResolver} from '@hookform/resolvers/yup';
import ChangePersonalInfo from 'api/actions/setting/ChangePersonalInfo';
import {INFO_TYPE} from 'asset/enum';
import {StyleContainer, StyleText} from 'components/base';
import StyleDatetimePicker from 'components/base/picker/StyleDatetimePicker';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
    popUpPicker,
} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
        [INFO_TYPE.facebook]: yupValidate.default(),
        [INFO_TYPE.email]: yupValidate.email(),
        [INFO_TYPE.phone]: yupValidate.phone(),
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

    useEffect(() => {
        switch (typeChange) {
            case INFO_TYPE.facebook:
                setValue(INFO_TYPE.facebook, information?.facebook);
                break;
            case INFO_TYPE.email:
                setValue(INFO_TYPE.email, information?.email);
                break;
            case INFO_TYPE.phone:
                setValue(INFO_TYPE.phone, information?.phone);
                break;
            case INFO_TYPE.gender:
                setValue(INFO_TYPE.gender, information?.gender);
                break;
            case INFO_TYPE.birthday:
                setValue(INFO_TYPE.birthday, information?.birthday);
                break;
            default:
                break;
        }
    }, [reset]);

    /**
     *   For gender picker and birthday
     */
    const [idGender, setIdGender] = useState(information.gender);
    const chooseGender = (gender: any) => {
        setIdGender(gender.id);
        setValue(INFO_TYPE.gender, t(gender.name));
    };
    const onNavigateGenderPicker = () => {
        popUpPicker({
            data: renderListGender,
            renderItem: (item: any) => (
                <View style={styles.elementPicker}>
                    <StyleText
                        i18Text={item.name}
                        customStyle={[
                            styles.textPicker,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            ),
            itemHeight: verticalScale(50),
            onSetItemSelected: chooseGender,
            initIndex:
                renderListGender.findIndex(item => item.id === idGender) || 0,
        });
    };

    const [temptBirthday, setTemptBirthday] = useState(
        information?.birthday || new Date(2000, 11, 14),
    );
    const [birthdayShow, setBirthdayShow] = useState(false);
    const onChangeDateTimePicker = (selectedDate: Date) => {
        const currentDate = selectedDate || temptBirthday;
        if (!isIOS) {
            setBirthdayShow(!birthdayShow);
        }
        setTemptBirthday(currentDate);
        setValue(INFO_TYPE.birthday, convertToFormatDate(currentDate));
    };

    /**
     * When click button Done,
     * If not valid will show alert, else show confirm change
     */
    const [typeChange, setTypeChange] = useState('facebook');

    const agreeChange = async (typeChange_: string) => {
        let newInfo: any;
        if (typeChange_ === INFO_TYPE.birthday) {
            newInfo = temptBirthday;
            setBirthdayShow(false);
        } else if (typeChange_ === INFO_TYPE.gender) {
            newInfo = idGender;
        } else {
            newInfo = getValues(typeChange_);
        }

        // change email or phone
        if (
            typeChange_ === INFO_TYPE.email ||
            typeChange_ === INFO_TYPE.phone
        ) {
            navigate(SETTING_ROUTE.enterPassword, {
                newInfo,
                typeChange: typeChange_,
            });
        }
        // change facebook, gender, birthday
        else {
            try {
                Redux.setIsLoading(true);
                await ChangePersonalInfo.changeInfo(newInfo, typeChange_);
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    const refuseChange = () => {
        setReset(!reset);
        goBack();
    };

    const openConfirmChange = async (typeChange_: string) => {
        setTypeChange(typeChange_);
        const tempInfo = () => {
            switch (typeChange_) {
                case INFO_TYPE.facebook:
                    return information.facebook;
                case INFO_TYPE.email:
                    return information.email;
                case INFO_TYPE.phone:
                    return information.phone;
                case INFO_TYPE.gender:
                    return t(chooseTextFromIdGender(information.gender));
                case INFO_TYPE.birthday:
                    return convertToFormatDate(information.birthday);
                default:
                    return '';
            }
        };

        if (getValues(typeChange_) === tempInfo()) {
            return;
        }

        if (errors[typeChange_]) {
            appAlert(errors[typeChange_].message);
        } else {
            appAlertYesNo({
                i18Title: 'setting.personalInfo.alertCfChange',
                agreeChange: () => agreeChange(typeChange_),
                refuseChange,
            });
        }
    };

    return (
        <>
            <StyleHeader title="setting.personalInfo.headerTitle" />

            <StyleContainer customStyle={styles.container}>
                <FormProvider {...form}>
                    {/* <BoxInfo
                        type={INFO_TYPE.facebook}
                        initValue={information?.facebook}
                        openConfirmChange={() =>
                            openConfirmChange(INFO_TYPE.facebook)
                        }
                        icon={
                            <Feather
                                name="facebook"
                                style={[
                                    styles.icon,
                                    {color: theme.borderColor},
                                ]}
                            />
                        }
                    /> */}

                    <BoxInfo
                        type={INFO_TYPE.email}
                        initValue={information?.email}
                        openConfirmChange={() =>
                            openConfirmChange(INFO_TYPE.email)
                        }
                        icon={
                            <Entypo
                                name="email"
                                style={[
                                    styles.icon,
                                    {color: theme.borderColor},
                                ]}
                            />
                        }
                    />

                    {/* <BoxInfo
                        type={INFO_TYPE.phone}
                        initValue={information?.phone}
                        openConfirmChange={() =>
                            openConfirmChange(INFO_TYPE.phone)
                        }
                        icon={
                            <Feather
                                name="phone"
                                style={[
                                    styles.icon,
                                    {color: theme.borderColor},
                                ]}
                            />
                        }
                    /> */}

                    <BoxInfo
                        type={INFO_TYPE.gender}
                        initValue={t(
                            chooseTextFromIdGender(information?.gender),
                        )}
                        openConfirmChange={() =>
                            openConfirmChange(INFO_TYPE.gender)
                        }
                        setOpenPicker={onNavigateGenderPicker}
                        icon={
                            <Feather
                                name="user"
                                style={[
                                    styles.icon,
                                    {color: theme.borderColor},
                                ]}
                            />
                        }
                    />

                    <BoxInfo
                        type={INFO_TYPE.birthday}
                        initValue={convertToFormatDate(information?.birthday)}
                        openConfirmChange={() =>
                            openConfirmChange(INFO_TYPE.birthday)
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
                        onChangeDateTime={onChangeDateTimePicker}
                        onPressBackground={() => setBirthdayShow(false)}
                    />
                )}
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '10@vs',
    },
    icon: {
        fontSize: '18@ms',
    },
    iconBirthday: {
        fontSize: '15@ms',
    },
    elementPicker: {
        height: '50@vs',
        justifyContent: 'center',
    },
    textPicker: {
        fontWeight: 'bold',
        fontSize: '20@ms',
    },
});

export default PersonalInformation;
