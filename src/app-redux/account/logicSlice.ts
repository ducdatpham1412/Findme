import {createSlice} from '@reduxjs/toolkit';
import {
    TypeBubblePalaceAction,
    TypeChatMessageResponse,
    TypeChatTagResponse,
    TypeGradient,
} from 'api/interface';
import {DEFAULT_IMAGE_BACKGROUND} from 'asset/standardValue';
import {HobbyType} from 'hook/useRedux';

export const initialLogicState = {
    isLoading: true,

    token: null, // is set from active user in async, to handle SocketProvider

    displayBubbleFrame: false, // for display BubbleFrame in Discovery
    indexBubble: 0, // index to push in tabBar

    listChatTag: <Array<TypeChatTagResponse>>[],
    chatTagFocusing: '', // this flag to check if socket do action update chat tag hasNewMessage
    listMessagesEnjoy: <
        Array<{
            chatTag: string;
            messages: Array<TypeChatMessageResponse>;
        }>
    >[],

    bubblePalaceAction: <TypeBubblePalaceAction>{},
    borderMessRoute: 'yellow',

    // notification
    numberNewMessages: 0,
    chatTagFromNotification: undefined,

    // is use when user block other and OtherProfile should re-render
    shouldRenderOtherProfile: true,

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
        setDisplayBubbleFrame: (state, action) => {
            state.displayBubbleFrame = action.payload;
        },
        setIndexBubble: (state, action) => {
            state.indexBubble = action.payload;
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
        setListMessagesEnjoy: (state, action) => {
            state.listMessagesEnjoy = action.payload;
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
    },
});

export const logicSliceAction = logicSlice.actions;

export default logicSlice.reducer;
