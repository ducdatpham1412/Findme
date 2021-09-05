import {createSlice} from '@reduxjs/toolkit';
import {
    TypeBubblePalace,
    TypeChatTagResponse,
    TypeMyBubbles,
} from 'api/interface';
import {HobbyType} from 'hook/useRedux';

export const initialLogicState = {
    isLoading: true, //only use for RootScreen and Starter

    token: null, // is set from active user in async, to handle SocketProvider

    displayBubbleFrame: false, // for display BubbleFrame in Discovery
    indexBubble: 0, // index to push in tabBar

    listChatTag: <Array<TypeChatTagResponse>>[],
    chatTagFocusing: '', // this flag to check if socket do action update chat tag hasNewMessage

    bubblePalace: <Array<TypeBubblePalace>>[],

    resource: {
        listHobbies: <Array<HobbyType>>[],
        listBubbles: <Array<TypeMyBubbles>>[],
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
            state.bubblePalace = action.payload;
        },
    },
});

export const logicSliceAction = logicSlice.actions;

export default logicSlice.reducer;
