import {TypeCreateGroupBuying} from 'api/interface/discovery';
import {createSlice} from '@reduxjs/toolkit';
import {
    TypeBubblePalace,
    TypeBubblePalaceAction,
    TypeChatTagResponse,
    TypeCreatePostRequest,
    TypeGradient,
} from 'api/interface';
import {DEFAULT_IMAGE_BACKGROUND} from 'asset/standardValue';
import {HobbyType} from 'hook/useRedux';

export type ReduxPostCreatedHandle = {
    status: 'loading' | 'success' | 'error' | 'done';
    data: TypeCreatePostRequest | TypeCreateGroupBuying | undefined;
};

export const initialLogicState = {
    isLoading: false,

    token: null, // is set from active user in async, to handle SocketProvider

    listChatTag: <Array<TypeChatTagResponse>>[],
    chatTagFocusing: '', // this flag to check if socket do action update chat tag hasNewMessage

    bubblePalaceAction: <TypeBubblePalaceAction>{},
    isLogOut: false,
    borderMessRoute: 'yellow',

    bubbleFocusing: <TypeBubblePalace>{},

    // notification
    numberNewMessages: 0,
    chatTagFromNotification: undefined,
    numberNewNotifications: 0,

    // is use when user block other and OtherProfile should re-render
    shouldRenderOtherProfile: true,
    scrollMainAndChatEnable: true,

    postCreatedHandling: <ReduxPostCreatedHandle>{
        status: 'done',
    },

    resource: {
        listHobbies: <Array<HobbyType>>[],
        imageBackground: DEFAULT_IMAGE_BACKGROUND,
        gradient: <TypeGradient>{},
    },
};

const logicSlice = createSlice({
    name: 'logicAppSlice',
    initialState: initialLogicState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setResource: (state, action) => {
            state.resource = action.payload;
        },
        setListChatTag: (state, action) => {
            state.listChatTag = action.payload;
        },
        setChatTagFocusing: (state, action) => {
            state.chatTagFocusing = action.payload;
        },
        setBubblePalace: (state, action) => {
            state.bubblePalaceAction = action.payload;
        },
        setNumberNewMessages: (state, action) => {
            state.numberNewMessages = action.payload;
        },
        setChatTagFromNotification: (state, action) => {
            state.chatTagFromNotification = action.payload;
        },
        setBorderMessRoute: (state, action) => {
            state.borderMessRoute = action.payload;
        },
        setShouldRenderOtherProfile: (state, action) => {
            state.shouldRenderOtherProfile = action.payload;
        },
        setBubbleFocusing: (state, action) => {
            state.bubbleFocusing = action.payload;
        },
        setNumberNewNotification: (state, action) => {
            state.numberNewNotifications = action.payload;
        },
        setPostCreatedHandling: (state, action) => {
            state.postCreatedHandling = action.payload;
        },
        setIsLogOut: (state, action) => {
            state.isLogOut = action.payload;
        },
        setScrollMainAndChatEnable: (state, action) => {
            state.scrollMainAndChatEnable = action.payload;
        },
    },
});

export const logicSliceAction = logicSlice.actions;

export default logicSlice.reducer;
