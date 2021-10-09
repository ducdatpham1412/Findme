import {
    TypeBubblePalace,
    TypeChatTagResponse,
    TypeMyBubbles,
} from 'api/interface';
import {
    accountSliceAction,
    initialAccountState,
} from 'app-redux/account/accountSlice';
import {
    initialLogicState,
    logicSliceAction,
} from 'app-redux/account/logicSlice';
import FindmeStore, {RootState} from 'app-redux/store';
import {themeType} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import {useSelector} from 'react-redux';

interface LoginType {
    username?: string;
    password?: string;
}
export interface PassportType {
    profile?: {
        id?: number;
        name?: string;
        description?: string;
        avatar?: string;
        cover?: string;
        followers?: number;
        followings?: number;
        listPosts?: Array<any>;
        relationship?: number;
    };
    information?: {
        facebook?: any;
        email?: string;
        phone?: string;
        gender?: any;
        birthday?: Date;
    };
    setting?: {
        theme?: number;
        language?: number;
        display_avatar?: boolean;
    };
}

export interface HobbyType {
    id: number;
    name: string;
    icon: string;
    liked: boolean;
}

interface ResourceType {
    listHobbies?: Array<HobbyType>;
    listBubbles?: Array<TypeMyBubbles>;
}

export const Redux = {
    /**
     * IN LOGIC APP SLICE
     */
    getIsLoading: () =>
        useSelector((state: RootState) => state.logicSlice.isLoading),

    getResource: () =>
        useSelector((state: RootState) => state.logicSlice.resource),

    getIndexBubble: () =>
        useSelector((state: RootState) => state.logicSlice.indexBubble),
    getDisplayBubbleFrame: () =>
        useSelector((state: RootState) => state.logicSlice.displayBubbleFrame),

    getListChatTag: (): Array<TypeChatTagResponse> =>
        useSelector((state: RootState) => state.logicSlice.listChatTag),
    getChatTagFocusing: () =>
        useSelector((state: RootState) => state.logicSlice.chatTagFocusing),

    getToken: () => useSelector((state: RootState) => state.logicSlice.token),

    getBubblePalace: () =>
        useSelector((state: RootState) => state.logicSlice.bubblePalace),
    // getBubblePalaceOutCpn: () => FindmeStore.getState().logicSlice.bubblePalace,

    // SET METHOD
    setIsLoading: (status: boolean) => {
        FindmeStore.dispatch(logicSliceAction.setIsLoading(status));
    },

    updateResource: (update: ResourceType) => {
        const newResource = {
            ...FindmeStore.getState().logicSlice.resource,
            ...update,
        };
        FindmeStore.dispatch(logicSliceAction.setResource(newResource));
    },

    setIndexBubble: (index: number) => {
        FindmeStore.dispatch(logicSliceAction.setIndexBubble(index));
    },
    setDisplayBubbleFrame: (value: boolean) => {
        FindmeStore.dispatch(logicSliceAction.setDisplayBubbleFrame(value));
    },

    updateListChatTag: (newList: any) => {
        FindmeStore.dispatch(logicSliceAction.setListChatTag(newList));
    },
    updateAnIndexInListChatTag: (newInstance: TypeChatTagResponse) => {
        const {listChatTag} = FindmeStore.getState().logicSlice;
        const temp = listChatTag.map(item => {
            if (item.id !== newInstance.id) {
                return item;
            } else {
                return newInstance;
            }
        });
        Redux.updateListChatTag(temp);
    },
    setChatTagFocusing: (value: string) => {
        FindmeStore.dispatch(logicSliceAction.setChatTagFocusing(value));
    },

    setToken: (newToken: string) => {
        FindmeStore.dispatch(logicSliceAction.setToken(newToken));
    },

    addBubblePalace: (newBubble: TypeBubblePalace) => {
        const listNow = FindmeStore.getState().logicSlice.bubblePalace;
        FindmeStore.dispatch(
            logicSliceAction.setBubblePalace(listNow.concat(newBubble)),
        );
    },

    /** ------------------------------
     * IN ACCOUNT SLICE
     */
    getLogin: () => FindmeStore.getState().accountSlice.login,

    getPassport: () =>
        useSelector((state: RootState) => state.accountSlice.passport),

    getTheme: () => {
        return useSelector(
            (state: RootState) => state.accountSlice.passport.setting.theme,
        ) === themeType.darkTheme
            ? Theme.darkTheme
            : Theme.lightTheme;
    },

    getThemeKeyboard: () => {
        const theme =
            FindmeStore.getState().accountSlice.passport.setting.theme;
        return theme === themeType.darkTheme ? 'dark' : 'light';
    },

    getModeExp: () => FindmeStore.getState().accountSlice.modeExp,

    // SET METHOD
    updateLogin: (update: LoginType) => {
        const {username, password} = FindmeStore.getState().accountSlice.login;
        FindmeStore.dispatch(
            accountSliceAction.updateLogin({
                username: update?.username || username,
                password: update?.password || password,
            }),
        );
    },

    // profile
    updatePassport: (newProfile: PassportType) => {
        const current = FindmeStore.getState().accountSlice.passport;
        const tempBirthday = newProfile.information?.birthday;

        const temp: PassportType = {
            profile: {...current.profile, ...newProfile.profile},
            information: {
                ...current.information,
                ...newProfile.information,
                birthday: tempBirthday
                    ? new Date(tempBirthday)
                    : current.information.birthday,
            },
            setting: {...current.setting, ...newProfile.setting},
        };

        FindmeStore.dispatch(accountSliceAction.updatePassport(temp));
    },

    setTheme: (updateTheme: number) => {
        Redux.updatePassport({setting: {theme: updateTheme}});
    },

    setModeExp: (value: boolean) => {
        FindmeStore.dispatch(accountSliceAction.setModeExp(value));
    },

    logOut: () => {
        Redux.setModeExp(true);
        Redux.setToken('logout');
        Redux.updatePassport(initialAccountState.passport);
        Redux.updateResource(initialLogicState.resource);
    },
};

export default Redux;
