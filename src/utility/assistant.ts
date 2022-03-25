import {
    TypeChatTagResponse,
    TypeCreatePostResponse,
    TypeGradient,
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
import {PRIVATE_AVATAR} from 'asset/standardValue';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {
    DISCOVERY_ROUTE,
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    SETTING_ROUTE,
} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {useState} from 'react';
import {Platform} from 'react-native';
import ImageUploader, {ImagePickerParamsType} from './ImageUploader';
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

export const interactBubble = (params: {
    itemBubble: any;
    isBubble: boolean;
    isEffectTabBar?: boolean;
}) => {
    navigate(ROOT_SCREEN.interactBubble, {
        item: params.itemBubble,
        isBubble: params.isBubble,
        isEffectTabBar: params.isEffectTabBar,
    });
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
    return temp.icon;
};

export const countDownToCancelRequestPublic = (params: {
    chatTagId: string;
    setList: any;
}) => {
    return setTimeout(() => {
        let focusChatTag: TypeChatTagResponse;
        const {listChatTag} = FindmeStore.getState().logicSlice;
        const temp = listChatTag.map(item => {
            if (item.id !== params.chatTagId) {
                return item;
            }
            focusChatTag = {
                ...item,
                isRequestingPublic: false,
            };
            return focusChatTag;
        });
        params.setList(temp);
    }, 9000);
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
    if (id === LANGUAGE_TYPE.en) {
        tempLanguage = 'en';
    } else if (id === LANGUAGE_TYPE.vi) {
        tempLanguage = 'vi';
    }
    return tempLanguage;
};

export const modalizeOptionPost = (params: {
    itemPostFromEdit: TypeCreatePostResponse;
    deleteAPostInList: any;
}) => {
    return [
        {
            text: 'profile.post.editPost',
            action: () => navigate(PROFILE_ROUTE.createPostPreview, params),
        },
        {
            text: 'profile.post.delete',
            action: params.deleteAPostInList,
        },
        {
            text: 'common.cancel',
            action: () => null,
        },
    ];
};

export const renderIconGender = (_gender?: number) => {
    const gender =
        _gender ||
        FindmeStore.getState().accountSlice.passport.information.gender;

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
    Redux.updateListChatTag([]);
    navigate(LOGIN_ROUTE.signUpForm, {
        typeSignUp: SIGN_UP_TYPE.email,
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
    const [list, setList] = useState<any>([]);

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
    onUnFollow(): void;
    onFollow(): void;
    isFollowing: boolean;
}) => {
    return [
        {
            text: params.isFollowing
                ? 'profile.screen.unFollow'
                : 'profile.screen.follow',
            action: async () => {
                try {
                    if (params.isFollowing) {
                        params.onUnFollow();
                    } else {
                        params.onFollow();
                    }
                } catch (err) {
                    appAlert(err);
                }
            },
        },
        {
            text: 'profile.modalize.block',
            action: () => {
                try {
                    params.onBlockUser();
                } catch (err) {
                    appAlert(err);
                }
            },
        },
        {
            text: 'profile.modalize.report',
            action: async () => {
                try {
                    params.onReport();
                } catch (err) {
                    appAlert(err);
                }
            },
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
