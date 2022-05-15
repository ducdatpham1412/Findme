import {HobbyType} from 'hook/useRedux';

// OTP
export interface TypeRequestOTPRequest {
    username: string;
    typeOTP: number;
    // only for register
    password?: string;
    confirmPassword?: string;
    // targetInfo for both register and changeInfo
    targetInfo?: number;
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
        // for login success
        token?: string;
        refreshToken?: string;
        // for account temporary locking
        username?: number;
        isLocking?: boolean;
    };
    [key: string]: any;
}

export interface TypeOpenAccountRequest {
    username: string;
    verifyCode: any;
}

// 2. register
export interface TypeRegisterReq {
    facebook: any;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
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
        numberNewNotifications: number;
    };
}

export interface TypeGradient {
    talking: Array<string>;
    movie: Array<string>;
    technology: Array<string>;
    gaming: Array<string>;
    animal: Array<string>;
    travel: Array<string>;
    fashion: Array<string>;
    other: Array<string>;
}

export interface TypeCommentResponse {
    id: string;
    content: string;
    numberLikes: number;
    isLiked: boolean;
    creatorId: number;
    creatorName: string;
    creatorAvatar: string;
    createdTime: string;
    listCommentsReply?: Array<TypeCommentResponse>;
    replyOf?: string; // this is for socket
}

export interface TypeAddCommentRequest {
    token: string;
    bubbleId: string;
    content: string;
    commentReplied: string;
}

export interface TypeJoinCommunityRequest {
    profilePostGroupId: string;
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
    id: number;
    name: string;
    anonymousName: string;
    description: string;
    avatar: string;
    cover: string;
    followers: number;
    followings: number;
    relationship: number;
}

export interface TypeEditProfileRequest {
    name?: string;
    anonymous_name?: string;
    description?: string;
    avatar?: string;
    cover?: string;
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

export interface TypeCreatePostRequest {
    content?: string;
    images?: Array<string>;
    color?: number;
    name?: string;
}

export interface TypeCreatePostResponse {
    id: string;
    content: string;
    images: Array<string>;
    totalLikes: number;
    totalComments: number;
    creatorId: number;
    creatorName: string;
    creatorAvatar: string;
    createdTime: string;
    color: number;
    name: string;
    isLiked: boolean;
    relationship: number;
}

export interface TypeCreateGroupResponse {
    id: string;
    content: string;
    images: Array<string>;
    chatTagId: string;
    creatorId: number;
    createdTime: string;
    color: number;
    name: string;
    relationship: number;
}

export interface TypeGetListPostProfile {
    success: boolean;
    data: Array<TypeCreatePostResponse>;
}

export interface TypeFollowResponse {
    id: number;
    name: string;
    avatar: string;
    description: string;
    relationship: number;
}

/**
 * DISCOVERY PALACE
 */
export interface TypeBubblePalace {
    id: string;
    content: string;
    images: Array<string>;
    totalLikes: number;
    hadKnowEachOther: boolean;
    creatorId: number;
    creatorName: string;
    creatorAvatar: string | null;
    gender: number;
    createdTime: string;
    totalComments: number;
    color: number;
    name: string;
    isLiked: boolean;
    relationship: number;
}

export interface TypeBubblePalaceAction {
    action: number;
    payload: any;
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
    content: string;
    listUser: Array<number>; // [1, 2]
    color: number;
    senderId: number;
    // two below only for send from bubble palace
    nameBubble?: string;
    idBubble?: string;
}
// export interface TypeChatTagEnjoyRequest {
//     myId: number;
//     newChatTag: TypeChatTagRequest;
// }

export interface TypeMemberInListChatTag {
    id: number;
    name: string;
    avatar: string;
    gender: number;
}
export interface TypeChatTagResponse {
    id: any;
    listUser: Array<TypeMemberInListChatTag>;
    groupName: string;
    image?: string;
    isPrivate: boolean;
    isStop: boolean;
    isBlock: boolean;
    userSeenMessage: {
        [key: string]: {
            latestMessage: string;
            isLatest: boolean;
        };
    };
    type: number;
    updateTime: Date;
    color: number;
    // append in front-end
    isRequestingPublic?: boolean;
    hadRequestedPublic?: boolean;
    userTyping?: Array<number>;
}

export interface TypeChatTagEnjoyResponse {
    newChatTag: TypeChatTagResponse;
    newMessage: TypeChatMessageResponse;
}

export interface TypeChatMessageSend {
    chatTag: number;
    groupName: string;
    type: number;
    content: string | Array<string>;
    senderId: number;
    senderAvatar: string;
    listUser: Array<number>;
    tag: string; // to check message comeback sender after set local message, string Date
}

export interface TypeChatMessageResponse {
    id: string;
    chatTag: any;
    type: number;
    content: string & Array<string>;
    senderId: number;
    senderAvatar: string;
    senderName: string;
    createdTime: string;
    tag?: string | undefined; // to check message comeback sender after set local message
    // in front-end
    relationship: number;
}

export interface TypeChangeGroupNameResponse {
    chatTagId: string;
    newName: string;
}

export interface TypeChangeChatColor {
    chatTagId: string;
    newColor: number;
}

export interface TypeDeleteMessageRequest {
    chatTagId: string;
    messageId: string;
}

// seen message
export interface TypeSeenMessageResponse {
    chatTagId: string;
    data: {
        [key: string]: {
            latestMessage: string;
            isLatest: boolean;
        };
    };
}

export interface TypeSeenMessageEnjoyResponse {
    chatTagId: string;
    userSeen: any;
}

// bubbles

export interface TypeResourceResponse {
    success: boolean;
    data: {
        listHobbies: Array<HobbyType>;
        imageBackground: string;
    };
}

// others
export interface TypeParamsPaging {
    params: {
        pageIndex: number;
        take: number;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface TypeReportUserRequest {
    reason: string;
    description: string;
    listImages: Array<string>;
}

export interface TypeDeleteMessageResponse {
    chatTagId: string;
    messageId: string;
}

export interface TypingResponse {
    chatTagId: string;
    userId: number;
}

/**
 * NOTIFICATION
 */
export interface TypeNotificationResponse {
    id: string;
    type: number;
    content: string;
    image: string;
    creatorId: number;
    hadRead: boolean;
    chatTagId?: string;
    bubbleId?: string;
}
