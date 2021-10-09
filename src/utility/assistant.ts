import {TypeMemberInListChatTag} from 'api/interface';
import FindmeStore from 'app-redux/store';
import {GENDER_TYPE, languageType, themeType} from 'asset/enum';
import Images from 'asset/img/images';
import {PRIVATE_AVATAR} from 'asset/standardValue';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {
    DISCOVERY_ROUTE,
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    SETTING_ROUTE,
} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import {Animated, Platform} from 'react-native';
import {checkCamera, checkPhoto} from './permission/permission';
import ImageUploader, {ImagePickerParamsType} from './upload/ImageUploader';

/**
 * FOR CARD STYLE
 */
export const selectBgCardStyle = (opacity?: number) => {
    const temp = FindmeStore.getState().accountSlice.passport.setting.theme;
    const valueOpacity = opacity || 0.9;
    return temp === themeType.darkTheme
        ? `rgba(8, 16, 25, ${valueOpacity})`
        : `rgba(255, 255, 255, ${valueOpacity})`;
};

/**
 * DISCOVERY PALACE
 */
export const openHeartBox = (setShowTabBar: any) => {
    const modeExp = Redux.getModeExp();
    if (modeExp) {
        appAlert('alert.clickHeartModeExp', {
            moreNotice: 'alert.moreButtonContent',
            moreAction: () => navigate(LOGIN_ROUTE.signUpType),
        });
    } else {
        navigate(DISCOVERY_ROUTE.heartScreen);
        setShowTabBar(false);
    }
};

export const openPlusBox = (setShowTabBar: any) => {
    const modeExp = Redux.getModeExp();

    if (modeExp) {
        appAlert('alert.clickPlusModeExp', {
            moreNotice: 'alert.moreButtonContent',
            moreAction: () => navigate(LOGIN_ROUTE.signUpType),
        });
    } else {
        navigate(DISCOVERY_ROUTE.plusScreen);
        setShowTabBar(false);
    }
};

export const openMessRoute = (
    aim: any,
    // isOpeningMess: boolean,
    // setIsOpeningMess: any,
    status: boolean,
    setStatus: any,
    setDisableTabBar: any,
) => {
    // if (!isOpeningMess) {
    //     setIsOpeningMess(true);
    //     setDisableTabBar(true);
    //     Animated.timing(aim, {
    //         toValue: 1,
    //         duration: 200,
    //         useNativeDriver: true,
    //     }).start(() => setStatus(!status));
    // } else {
    Animated.timing(aim, {
        toValue: status ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
    }).start(() => {
        setStatus(!status);
        setDisableTabBar(status ? false : true);
    });
    // }
};

export const interactBubble = (itemBubble: any, isBubble: boolean) => {
    navigate(ROOT_SCREEN.interactBubble, {
        item: itemBubble,
        isBubble,
    });
};

export const choosePrivateAvatar = () => {
    const {gender} = FindmeStore.getState().accountSlice.passport.information;

    switch (gender) {
        case GENDER_TYPE.man:
            return PRIVATE_AVATAR.boy;
        case GENDER_TYPE.woman:
            return PRIVATE_AVATAR.girl;
        case GENDER_TYPE.notToSay:
            return PRIVATE_AVATAR.lgbt;
        default:
            return '';
    }
};

/**
 * FOR EDIT PROFILE THAT IMAGE PICKER
 */
export const chooseImageFromLibrary = async (
    action: Function,
    params?: ImagePickerParamsType,
) => {
    try {
        const permission = await checkPhoto();
        if (permission) {
            const localPath: any = await ImageUploader.chooseImageFromLibrary(
                params,
            );

            if (params?.multiple) {
                action(localPath.map((item: any) => item.path));
            } else {
                action(localPath.path);
            }
        }
    } catch (err) {
        logger(err);
    }
};

export const chooseImageFromCamera = async (
    action: Function,
    params?: ImagePickerParamsType,
) => {
    try {
        const permission = await checkCamera();
        if (permission) {
            const localPath: any = await ImageUploader.chooseImageFromCamera(
                params,
            );

            if (params?.multiple) {
                action(localPath.map((item: any) => item.path));
            } else {
                action(localPath.path);
            }
        }
    } catch (err) {
        logger(err);
    }
};

/**
 * OTHERS
 */
export const convertToFormatDate = (value: any) => {
    const temp = value || new Date(1975, 3, 30);
    return String(temp.getDate())
        .concat(' / ')
        .concat(String(temp.getMonth() + 1))
        .concat(' / ')
        .concat(String(temp.getFullYear()));
};

export const isIOS = Platform.OS === 'ios';

export const optionsImagePicker = [
    'common.chooseFromCamera',
    'common.chooseFromLibrary',
    'common.cancel',
];

export function logger(one: any, two?: any, three?: any, four?: any) {
    // console.log(...arguments);
    if (__DEV__) {
        console.log(
            one,
            two !== undefined ? two : '',
            three !== undefined ? three : '',
            four !== undefined ? four : '',
        );
    }
}

export const renderListGender = [
    {
        id: GENDER_TYPE.man,
        name: 'login.detailInformation.man',
    },
    {
        id: GENDER_TYPE.woman,
        name: 'login.detailInformation.woman',
    },
    {
        id: GENDER_TYPE.notToSay,
        name: 'login.detailInformation.notToSay',
    },
];

export const chooseTextFromIdGender = (id: number | undefined) => {
    const temp = renderListGender.find(item => item.id === id);
    return temp?.name || '';
};

export const chooseLanguageFromId = (id: number) => {
    let tempLanguage = '';
    if (id === languageType.en) {
        tempLanguage = 'en';
    } else if (id === languageType.vi) {
        tempLanguage = 'vi';
    }
    return tempLanguage;
};

export const modalizeMyProfile = () => {
    return [
        {
            id: 0,
            text: 'profile.modalize.setting',
            action: () => navigate(PROFILE_ROUTE.settingRoute),
        },
        {
            id: 1,
            text: 'profile.modalize.myInfo',
            action: () =>
                navigate(PROFILE_ROUTE.settingRoute, {
                    screen: SETTING_ROUTE.personalInformation,
                }),
        },
    ];
};

export const modalizeYourProfile = (actions: {
    onBlockUser(): void;
    onReport(): void;
    onUnFollow(): void;
}) => {
    return [
        {
            id: 2,
            text: 'profile.screen.unFollow',
            action: async () => {
                try {
                    actions.onUnFollow();
                } catch (err) {
                    appAlert(err);
                }
            },
        },
        {
            id: 0,
            text: 'profile.modalize.block',
            action: () => {
                try {
                    actions.onBlockUser();
                } catch (err) {
                    appAlert(err);
                }
            },
        },
        {
            id: 1,
            text: 'profile.modalize.report',
            action: async () => {
                try {
                    actions.onReport();
                } catch (err) {
                    appAlert(err);
                }
            },
        },
    ];
};

export const renderIconGender = (_gender?: number) => {
    const gender =
        _gender !== undefined
            ? _gender
            : FindmeStore.getState().accountSlice.passport.information.gender;

    if (gender === GENDER_TYPE.man) {
        return Images.icons.boy;
    }
    if (gender === GENDER_TYPE.woman) {
        return Images.icons.girl;
    }
    if (gender === GENDER_TYPE.notToSay) {
        return Images.icons.lgbt;
    }
    return null;
};

/**
 * MESSAGE
 */
export const moveMeToEndOfListMember = (
    listMember: Array<TypeMemberInListChatTag>,
) => {
    const myId = FindmeStore.getState().accountSlice.passport.profile.id;

    const temp = [...listMember];
    let memberMe: any;

    let myIndex = -1;

    listMember.forEach((item, index) => {
        if (item.id === myId) {
            myIndex = index;
            memberMe = item;
            temp.splice(index, 1);
        }
    });

    if (myIndex === -1) {
        return temp;
    }
    return temp.concat(memberMe);
};
