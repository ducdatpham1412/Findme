/* eslint-disable react-hooks/rules-of-hooks */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TypeCreateGroupResponse,
    TypeGradient,
    TypeInteractBubble,
    TypeMemberInListChatTag,
} from 'api/interface';
import FindmeStore from 'app-redux/store';
import {
    GENDER_TYPE,
    LANGUAGE_TYPE,
    SIGN_UP_TYPE,
    THEME_TYPE,
    TYPE_COLOR,
} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {PRIVATE_AVATAR} from 'asset/standardValue';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    SETTING_ROUTE,
} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {useState} from 'react';
import {DevSettings, NativeScrollEvent, Platform} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import ImageUploader, {ImagePickerParamsType} from './ImageUploader';
import AuthenticateService from './login/loginService';
import {checkCamera, checkPhoto} from './permission/permission';

/**
 * FOR CARD STYLE
 */
export const selectBgCardStyle = (opacity?: number) => {
    const temp = FindmeStore.getState().accountSlice.passport.setting.theme;
    const valueOpacity = opacity || 0.9;
    return temp === THEME_TYPE.darkTheme
        ? `rgba(8, 16, 25, ${valueOpacity})`
        : `rgba(255, 255, 255, ${valueOpacity})`;
};

export const interactBubble = (params: TypeInteractBubble) => {
    navigate(ROOT_SCREEN.interactBubble, params);
};

export const choosePrivateAvatar = (_gender?: number) => {
    const gender =
        _gender ||
        FindmeStore.getState().accountSlice.passport.information.gender;

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

export const chooseIconHobby = (idHobby: number) => {
    const {listHobbies} = FindmeStore.getState().logicSlice.resource;
    const temp =
        listHobbies.find(item => item.id === idHobby) || listHobbies[0];
    return temp?.icon || '';
};

/**
 * FOR EDIT PROFILE THAT IMAGE PICKER
 */
export const chooseImageFromLibrary = async (
    action: Function,
    params?: ImagePickerParamsType,
    callBackFunction?: Function,
) => {
    try {
        const permission = await checkPhoto();
        if (permission) {
            const localPath: any = await ImageUploader.chooseImageFromLibrary(
                params,
            );

            callBackFunction?.();

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
    callBackFunction?: Function,
) => {
    try {
        const permission = await checkCamera();
        if (permission) {
            const localPath: any = await ImageUploader.chooseImageFromCamera(
                params,
            );

            callBackFunction?.();

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

export function logger(...args: any) {
    if (__DEV__) {
        console.log(...args);
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
    if (id === LANGUAGE_TYPE.en) {
        tempLanguage = 'en';
    } else if (id === LANGUAGE_TYPE.vi) {
        tempLanguage = 'vi';
    }
    return tempLanguage;
};

export const modalizeGoToChatTagFromGroup = (params: {chatTagId: string}) => {
    return [
        {
            text: 'profile.screen.goToChatTag',
            action: () => {
                Redux.setChatTagFromNotification(params.chatTagId);
            },
        },
        {
            text: 'common.cancel',
            action: () => null,
        },
    ];
};

export const modalizeOptionBubbleGroup = (params: {
    itemGroupFromEdit: TypeCreateGroupResponse | undefined;
    deleteAGroupFromList: any;
}) => {
    return [
        {
            text: 'profile.post.editPost',
            action: () => {
                navigate('profile_create_group', {
                    itemGroupFromEdit: params.itemGroupFromEdit,
                });
            },
        },
        {
            text: 'profile.post.delete',
            action: params.deleteAGroupFromList,
        },
        {
            text: 'common.cancel',
            action: () => null,
        },
    ];
};

export const renderIconGender = (_gender?: number) => {
    const gender =
        _gender === undefined
            ? FindmeStore.getState().accountSlice.passport.information.gender
            : _gender;

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

export const onGoToSignUp = () => {
    AuthenticateService.logOut({
        hadRefreshTokenBlacked: true,
        callBack: () => {
            navigate(LOGIN_ROUTE.signUpForm, {
                typeSignUp: SIGN_UP_TYPE.email,
            });
        },
    });
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

export const reorderListChatTag = (listChatTag: Array<any>, index: number) => {
    const temp = [listChatTag[index]];
    listChatTag.splice(index, 1);
    return temp.concat(listChatTag);
};

export const modeExpUsePaging = () => {
    const [list, setList] = useState<Array<any>>([]);

    return {
        list,
        noMore: true,
        refreshing: false,
        loadingMore: false,
        error: '',
        onRefresh: () => null,
        onLoadMore: () => null,
        setParams: () => null,
        setList,
    };
};

export const modalizeYourProfile = (params: {
    onBlockUser(): void;
    onReport(): void;
    onHandleFollow(): void;
    isFollowing: boolean;
}) => {
    return [
        {
            text: params.isFollowing
                ? 'profile.screen.unFollow'
                : 'profile.screen.follow',
            action: params.onHandleFollow,
        },
        {
            text: 'profile.modalize.block',
            action: params.onBlockUser,
        },
        {
            text: 'profile.modalize.report',
            action: params.onReport,
        },
        {
            text: 'common.cancel',
            action: () => null,
        },
    ];
};

export const modalizeMyProfile = [
    {
        text: 'profile.modalize.setting',
        action: () => navigate(PROFILE_ROUTE.settingRoute),
    },
    {
        text: 'profile.modalize.myInfo',
        action: () =>
            navigate(PROFILE_ROUTE.settingRoute, {
                screen: SETTING_ROUTE.personalInformation,
            }),
    },
    {
        text: 'profile.component.infoProfile.editProfile',
        action: () => navigate(PROFILE_ROUTE.editProfile),
    },
    {
        text: 'common.cancel',
        action: () => null,
    },
];

export const chooseColorGradient = (params: {
    listGradients: TypeGradient;
    colorChoose: number;
}) => {
    const {listGradients, colorChoose} = params;
    let color = listGradients.talking;
    switch (colorChoose) {
        case TYPE_COLOR.talking:
            color = listGradients.talking;
            break;
        case TYPE_COLOR.movie:
            color = listGradients.movie;
            break;
        case TYPE_COLOR.technology:
            color = listGradients.technology;
            break;
        case TYPE_COLOR.gaming:
            color = listGradients.gaming;
            break;
        case TYPE_COLOR.animal:
            color = listGradients.animal;
            break;
        case TYPE_COLOR.travel:
            color = listGradients.travel;
            break;
        case TYPE_COLOR.fashion:
            color = listGradients.fashion;
            break;
        case TYPE_COLOR.other:
            color = listGradients.other;
            break;
        default:
            color = listGradients.talking;
    }
    return color;
};

export function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

export const bubbleProfileHeight = () =>
    Metrics.height - Metrics.safeBottomPadding - Metrics.safeTopPadding;

export const bubbleProfileWidth = () =>
    Metrics.width - Metrics.safeLeftPadding - Metrics.safeRightPadding;

export const addMenuClearAsyncStorage = () => {
    if (__DEV__) {
        DevSettings.addMenuItem('Clear AsyncStorage', () => {
            AsyncStorage.clear();
            DevSettings.reload();
        });
    }
};

const paddingBottomCheckScroll = verticalScale(70);
export const isScrollCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
}: NativeScrollEvent) => {
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingBottomCheckScroll
    );
};
