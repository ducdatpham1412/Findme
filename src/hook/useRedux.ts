import {
    TypeBubblePalaceAction,
    TypeChatMessageResponse,
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
import {THEME_TYPE, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
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
    listBubbles?: Array<TypeMyBubbles>;
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

export const Redux = {
    /** ----------------------------
     * IN LOGIC SLICE
     * ----------------------------
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
    getListMessagesEnjoy: () =>
        useSelector((state: RootState) => state.logicSlice.listMessagesEnjoy),

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
    setChatTagFocusing: (value: string) => {
        FindmeStore.dispatch(logicSliceAction.setChatTagFocusing(value));
    },

    setToken: (newToken: string | null) => {
        FindmeStore.dispatch(logicSliceAction.setToken(newToken));
    },

    setBubblePalaceAction: (newBubble: TypeBubblePalaceAction) => {
        FindmeStore.dispatch(logicSliceAction.setBubblePalace(newBubble));
    },

    updateListMessageEnjoy: (
        newList: Array<{
            chatTag: string;
            messages: Array<TypeChatMessageResponse>;
        }>,
    ) => {
        FindmeStore.dispatch(logicSliceAction.setListMessagesEnjoy(newList));
    },
    addNewMessageEnjoy: (params: {
        chatTag: string;
        newMessage: TypeChatMessageResponse;
    }) => {
        const currentList = FindmeStore.getState().logicSlice.listMessagesEnjoy;
        const temp = currentList.map(item => {
            if (item.chatTag !== params.chatTag) {
                return item;
            }
            const newMessages = [params.newMessage].concat(item.messages);
            return {
                chatTag: item.chatTag,
                messages: newMessages,
            };
        });
        FindmeStore.dispatch(logicSliceAction.setListMessagesEnjoy(temp));
    },
    startNewMessageEnjoy: (params: {
        chatTagId: string;
        newMessage: TypeChatMessageResponse;
    }) => {
        const currentList = FindmeStore.getState().logicSlice.listMessagesEnjoy;
        const temp = [
            {
                chatTag: params.chatTagId,
                messages: [params.newMessage],
            },
        ].concat(currentList);
        FindmeStore.dispatch(logicSliceAction.setListMessagesEnjoy(temp));
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
        const theme =
            FindmeStore.getState().accountSlice.passport.setting.theme;
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
            listBubbles: newProfile.listBubbles || current.listBubbles,
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
        const passport = initialAccountState.passport;

        // Set modeExp can not set here, cuz it make row choose socket
        // of MessScreen render again while it's unmounting -> CRASH APP
        // Instead we will set when press button in Login or ChoosingLoginOrEnjoy
        // Redux.setModeExp(true);

        Redux.setToken(null);
        Redux.updatePassport({
            information: passport.information,
            profile: passport.profile,
            setting: {
                display_avatar: passport.setting.display_avatar,
            },
            listBubbles: passport.listBubbles,
        });
        Redux.updateResource(initialLogicState.resource);
        Redux.updateListChatTag([]);
        Redux.setBubblePalaceAction({
            action: TYPE_BUBBLE_PALACE_ACTION.clearAll,
            payload: undefined,
        });
    },
};

export default Redux;
