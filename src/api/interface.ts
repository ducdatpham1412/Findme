import {HobbyType} from 'hook/useRedux';

// OTP
export interface TypeRequestOTPRequest {
    username: string;
    targetInfo: number;
    typeOTP: number;
    // only for register
    destination?: string;
    password?: string;
    confirmPassword?: string;
}
export interface TypeRequestOTPResponse {
    success: boolean;
    data: any;
}
export interface TypeCheckOTPRequest {
    username: string;
    code: string;
}
export interface TypeCheckOTPResponse {
    success: boolean;
    [key: string]: any;
}

/**
 * AUTHENTICATE
 */

// 1. login
export interface TypeLoginRequest {
    username: string;
    password: string;
}
export interface TypeLoginResponse {
    success: boolean;
    data: {
        token: string;
        refreshToken: string;
    };
    [key: string]: any;
}

// 2. register
export interface TypeRegisterReq {
    username: string;
    password: string;
    confirmPassword: string;
    facebook: any;
    email: string;
    phone: string;
}
export interface TypeRegisterRes {
    success: boolean;
    data: any;
}

// 3. reset password
export interface TypeResetPasswordRequest {
    username: string;
    newPassword: string;
    confirmPassword: string;
}
export interface TypeResetPasswordResponse {
    success: boolean;
    data: any;
}

/**
 * COMMON
 */
export interface TypeGetPassportResponse {
    success: boolean;
    data: {
        profile: {
            id: number;
            name: string;
            description: string;
            avatar: string;
            cover: string;
            followers: number;
            followings: number;
            listPosts: Array<any>;
        };
        information: {
            facebook: any;
            email: string;
            phone: string;
            gender: any;
            birthday: Date;
        };
        setting: {
            theme: number;
            language: number;
        };
    };
}

/**
 * SETTING
 */
export interface TypeChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface TypeGetListBlockedResponse {
    success: boolean;
    data: any;
}

export interface TypeChangeInformationResponse {
    success: boolean;
    data: any;
}

/**
 * PROFILE
 */
export interface TypeGetProfileResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        description: string;
        avatar: string;
        cover: string;
        followers: number;
        followings: number;
        relationship: number;
    };
}

export interface TypeEditProfileRequest {
    name: string;
    description: string;
    avatar: string;
    cover: string;
}
export interface TypeEditProfileResponse {
    success: boolean;
    data: any;
}

export interface TypeSendMessageFromProfile {
    name: string;
    creatorId: number;
    creatorAvatar: string;
}

/**
 * DISCOVERY PALACE
 */
export interface TypeBubblePalace {
    id: number;
    name: string;
    icon: string;
    description: string;
    creatorId: number;
    creatorAvatar: string;
    // set up in front-end
    relationship?: number;
}

export interface TypeUpdateMyBubblesRequest {
    list: Array<{
        idHobby: number;
        description: string;
    }>;
}

/**
 * MESSENGER
 */

export interface TypeChatTagRequest {
    type: number; // CHAT_TAG.new
    message: string;
    listUser: Array<number>; // [1, 2]
    isPrivate: boolean;
    // two below only for send from bubble palace
    idBubble?: number;
    nameBubble?: string;
}

export interface TypeMemberInListChatTag {
    id: number;
    name: string;
    avatar: string;
    gender: number;
}
export interface TypeChatTagResponse {
    id: any;
    listUser: Array<TypeMemberInListChatTag>;
    type: number;
    groupName: string;
    isPrivate: boolean;
    isStop: boolean;
    updateTime: Date;
    // append in front-end
    hasNewMessage?: boolean;
    isRequestingPublic?: boolean;
}

export interface TypeChatMessageSend {
    chatTag: number;
    message: string;
    images: Array<string>;
    senderId: number;
    senderAvatar: string;
    listUser: Array<number>; // list_user
}

export interface TypeChatMessageResponse {
    id: number;
    chatTag: any;
    message: string;
    images: Array<string>;
    senderId: number;
    senderAvatar: string;
    createdTime: string;
    // in front-end
    relationship: number;
}

// bubbles
export interface TypeMyBubbles {
    idHobby: number;
    name: string;
    icon: string;
    description: string;
    privateAvatar: string;
}

export interface TypeResourceResponse {
    success: boolean;
    data: {
        listHobbies: Array<HobbyType>;
        listBubbles: Array<TypeMyBubbles>;
    };
}
