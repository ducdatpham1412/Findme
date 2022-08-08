import {TYPE_OS_LOGIN_SOCIAL, TYPE_SOCIAL_LOGIN} from 'asset/enum';
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

// Login Social
export interface TypeLoginSocialRequest {
    os: TYPE_OS_LOGIN_SOCIAL;
    provider: TYPE_SOCIAL_LOGIN;
}

// 2. register
export interface TypeRegisterReq {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    code: string;
}
export interface TypeRegisterRes {
    success: boolean;
    data: {
        token: string;
        refreshToken: string;
    };
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

export interface TypeChangeInformationRequest {
    email?: string;
    phone?: string;
    gender?: number;
    birthday?: string;
    name?: string;
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

export interface TypeInteractBubble {
    userId: number;
    name: string;
    avatar: string;
}

/**
 * MESSENGER
 */
export interface TypeConversationRequest {
    content: string;
    userId: number;
}

export interface TypeMemberInListChatTag {
    id: number;
    name: string;
    avatar: string;
    gender: number;
}
export interface TypeChatTagResponse {
    id: string;
    listUser: Array<TypeMemberInListChatTag>;
    conversationName: string;
    conversationImage: string;
    userData: {
        [key: string]: {
            created: string;
            modified: string;
        };
    };
    color: number;
    modified: string;
    status: number;
    isBlocked: boolean;
    latestMessage: string;
    // in front-end
    userTyping?: Array<number>;
}

export interface TypeChatMessageSend {
    conversationId: string;
    type: number;
    content: string | Array<string>;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    tag: string;
    // tag to check message comeback sender after set local message, string Date
}

export interface TypeChatMessageResponse {
    id: string;
    conversationId: string;
    type: number;
    content: string | Array<string>;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string | undefined;
    tag?: string | undefined; // to check message comeback sender after set local message
    // in front-end
    relationship: number;
}

export interface TypeChangeGroupNameResponse {
    conversationId: string;
    name: string;
}

export interface TypeChangeChatColor {
    conversationId: string;
    color: number;
}

export interface TypeChangeChatName {
    conversationId: string;
    name: string;
}

// seen message
export interface TypeSeenMessageResponse {
    conversationId: string;
    data: {
        [key: string]: {
            modified: string;
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
    conversationId: string;
    messageId: string;
}

export interface TypingResponse {
    conversationId: string;
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
