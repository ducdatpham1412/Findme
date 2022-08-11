/* eslint-disable react-hooks/rules-of-hooks */
import {TypeBubblePalaceAction, TypeChatTagResponse} from 'api/interface';
import {
    accountSliceAction,
    initialAccountState,
} from 'app-redux/account/accountSlice';
import {
    logicSliceAction,
    ReduxPostCreatedHandle,
} from 'app-redux/account/logicSlice';
import FindmeStore, {RootState, useAppSelector} from 'app-redux/store';
import {THEME_TYPE} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import {useSelector} from 'react-redux';

interface LoginType {
    username?: string;
    password?: string;
}
export interface PassportType {
    profile?: {
        id?: number | null | string; // if modeExp -> string '__1", else number
        name?: string;
        anonymousName?: string;
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
    liked?: boolean;
}

interface ResourceType {
    listHobbies?: Array<HobbyType>;
    imageBackground?: string;
}

interface TypeBubblePalaceUpdate {
    id?: string;
    content?: string;
    images?: Array<string>;
    totalLikes?: number;
    hadKnowEachOther?: boolean;
    creatorId?: number;
    creatorName?: string;
    creatorAvatar?: string | null;
    gender?: number;
    createdTime?: string;
    totalComments?: number;
    color?: number;
    name?: string;
    isLiked?: boolean;
    relationship?: number;
}

export const Redux = {
    /** ----------------------------
     * IN LOGIC SLICE
     * ----------------------------
     */
    getIsLoading: () =>
        useSelector((state: RootState) => state.logicSlice.isLoading),

    getResource: () =>
        useSelector((state: RootState) => state.logicSlice.resource),

    getListChatTag: (): Array<TypeChatTagResponse> =>
        useSelector((state: RootState) => state.logicSlice.listChatTag),
    getChatTagFocusing: () =>
        useSelector((state: RootState) => state.logicSlice.chatTagFocusing),

    getToken: () => useSelector((state: RootState) => state.logicSlice.token),

    getBubblePalaceAction: () =>
        useSelector((state: RootState) => state.logicSlice.bubblePalaceAction),

    getNumberNewMessages: () =>
        useSelector((state: RootState) => state.logicSlice.numberNewMessages),

    getBorderMessRoute: () =>
        useSelector((state: RootState) => state.logicSlice.borderMessRoute),

    getShouldRenderOtherProfile: () =>
        useSelector(
            (state: RootState) => state.logicSlice.shouldRenderOtherProfile,
        ),
    getChatTagFromNotification: () =>
        useSelector(
            (state: RootState) => state.logicSlice.chatTagFromNotification,
        ),
    getBubbleFocusing: () =>
        useSelector((state: RootState) => state.logicSlice.bubbleFocusing),
    getDisplayComment: () =>
        useSelector((state: RootState) => state.logicSlice.displayComment),
    getNumberNewNotifications: () =>
        useSelector(
            (state: RootState) => state.logicSlice.numberNewNotifications,
        ),
    getCreatedPostHandling: () =>
        useAppSelector(state => state.logicSlice.postCreatedHandling),

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

    updateListChatTag: (newList: any) => {
        FindmeStore.dispatch(logicSliceAction.setListChatTag(newList));
    },
    setChatTagFocusing: (value: string) => {
        FindmeStore.dispatch(logicSliceAction.setChatTagFocusing(value));
    },

    setToken: (newToken: string | null) => {
        FindmeStore.dispatch(logicSliceAction.setToken(newToken));
    },

    setBubblePalaceAction: (newBubble: TypeBubblePalaceAction) => {
        FindmeStore.dispatch(logicSliceAction.setBubblePalace(newBubble));
    },

    setNumberNewMessage: (value: number) => {
        FindmeStore.dispatch(logicSliceAction.setNumberNewMessages(value));
    },

    setBorderMessRoute: (color: string) => {
        FindmeStore.dispatch(logicSliceAction.setBorderMessRoute(color));
    },

    setShouldRenderOtherProfile: (value: boolean) => {
        FindmeStore.dispatch(
            logicSliceAction.setShouldRenderOtherProfile(value),
        );
    },

    setChatTagFromNotification: (value: string | undefined) => {
        FindmeStore.dispatch(
            logicSliceAction.setChatTagFromNotification(value),
        );
    },

    updateBubbleFocusing: (value: TypeBubblePalaceUpdate) => {
        FindmeStore.dispatch(
            logicSliceAction.setBubbleFocusing({
                ...FindmeStore.getState().logicSlice.bubbleFocusing,
                ...value,
            }),
        );
    },
    increaseTotalCommentsOfBubbleFocusing: (value: number) => {
        const temp = FindmeStore.getState().logicSlice.bubbleFocusing;
        Redux.updateBubbleFocusing({
            totalComments: temp.totalComments + value,
        });
    },
    setDisplayComment: (value: boolean) => {
        FindmeStore.dispatch(logicSliceAction.setDisplayComment(value));
    },
    setNumberNewNotifications: (value: number) => {
        FindmeStore.dispatch(logicSliceAction.setNumberNewNotification(value));
    },
    setPostCreatedHandling: (value: ReduxPostCreatedHandle) => {
        FindmeStore.dispatch(logicSliceAction.setPostCreatedHandling(value));
    },

    /**
     *
     */
    /** ----------------------------
     * IN ACCOUNT SLICE
     * ----------------------------
     */
    getLogin: () => FindmeStore.getState().accountSlice.login,

    getPassport: () =>
        useSelector((state: RootState) => state.accountSlice.passport),

    getTheme: () => {
        const temp = useSelector(
            (state: RootState) => state.accountSlice.passport.setting.theme,
        );
        return temp === THEME_TYPE.darkTheme
            ? Theme.darkTheme
            : Theme.lightTheme;
    },

    getThemeKeyboard: () => {
        const {theme} = FindmeStore.getState().accountSlice.passport.setting;
        return theme === THEME_TYPE.darkTheme ? 'dark' : 'light';
    },

    getModeExp: () =>
        useSelector((state: RootState) => state.accountSlice.modeExp),

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
        const {passport} = initialAccountState;

        // Set modeExp can not set here, cuz it make row choose socket
        // of MessScreen render again while it's unmounting -> CRASH APP
        // Instead we will set when press button in Login or ChoosingLoginOrEnjoy
        // Redux.setModeExp(true);

        Redux.setToken(null);
        Redux.setModeExp(false);
        Redux.updatePassport({
            information: passport.information,
            profile: passport.profile,
            setting: {
                display_avatar: passport.setting.display_avatar,
            },
        });
        Redux.updateListChatTag([]);
    },
};

export default Redux;
