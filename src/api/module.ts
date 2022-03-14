import {
    TypeBubblePalace,
    TypeChangeInformationResponse,
    TypeChangePasswordRequest,
    TypeChatMessageResponse,
    TypeChatTagResponse,
    TypeCheckOTPRequest,
    TypeCheckOTPResponse,
    TypeCreatePostRequest,
    TypeCreatePostResponse,
    TypeDeleteMessageRequest,
    TypeEditProfileRequest,
    TypeEditProfileResponse,
    TypeGetListBlockedResponse,
    TypeGetPassportResponse,
    TypeGetProfileResponse,
    TypeLoginRequest,
    TypeLoginResponse,
    TypeOpenAccountRequest,
    TypeParamsPaging,
    TypeRegisterReq,
    TypeRegisterRes,
    TypeReportUserRequest,
    TypeRequestOTPRequest,
    TypeRequestOTPResponse,
    TypeResetPasswordRequest,
    TypeResetPasswordResponse,
    TypeResourceResponse,
    TypeUpdateMyBubblesRequest,
} from './interface';
import request from './request';

// OTP
export const apiRequestOTP = (
    params: TypeRequestOTPRequest,
): Promise<TypeRequestOTPResponse> => {
    return request.post('/auth/request-otp', params);
};
export const apiCheckOTP = (
    params: TypeCheckOTPRequest,
): Promise<TypeCheckOTPResponse> => {
    return request.post('/auth/check-otp', params);
};

/**
 *  AUTHENTICATION
 */
export const apiLogin = (
    params: TypeLoginRequest,
): Promise<TypeLoginResponse> => {
    return request.post('/auth/login', params);
};

export const apiRegister = (
    params: TypeRegisterReq,
): Promise<TypeRegisterRes> => {
    return request.post('/auth/register', params);
};

export const apiResetPassword = (
    params: TypeResetPasswordRequest,
): Promise<TypeResetPasswordResponse> => {
    return request.put('/auth/reset-password', params);
};

export const apiLogOut = (refreshToken: string) => {
    return request.post('/auth/log-out', {
        refreshToken,
    });
};

export const apiGetIdEnjoyMode = () => {
    return request.get('/auth/get-id-enjoy-mode');
};

export const apiLockAccount = () => {
    return request.put('/auth/lock-account');
};

export const apiOpenAccount = (params: TypeOpenAccountRequest) => {
    return request.put('/auth/open-account', params);
};
export const apiRequestDeleteAccount = () => {
    return request.put('auth/delete-account');
};

/**
 *  COMMON
 */
export const apiGetPassport = (): Promise<TypeGetPassportResponse> => {
    return request.get('/common/get-passport');
};

export const apiGetResource = (): Promise<TypeResourceResponse> => {
    return request.get('/common/get-resource');
};

export const apiUploadImage = (formData: any, quality?: number) =>
    request.post('/common/upload-image', formData, {
        params: {
            quality: quality || undefined,
        },
    });

export const apiUpdateMyBubbles = (params: TypeUpdateMyBubblesRequest) => {
    return request.put('/common/update-my-bubbles', params.list);
};

export const apiReportUser = (params: {
    userId: number;
    body: TypeReportUserRequest;
}) => {
    return request.post(`/common/report-user/${params.userId}`, params.body);
};

export const apiGetListBubbleActive = ({
    params,
}: TypeParamsPaging): Promise<TypeBubblePalace> => {
    return request.get('/common/get-list-bubble-profile', {
        params,
    });
};

export const apiGetListBubbleActiveOfUserEnjoy = ({
    params,
}: TypeParamsPaging): Promise<TypeBubblePalace> => {
    return request.get('/common/get-list-bubble-profile-enjoy', {
        params,
    });
};

/**
 *  DISCOVERY and CHAT
 */
export const apiGetListChatTags = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    pageIndex: number;
    take: number;
    totalPages: number;
    data: Array<TypeChatTagResponse>;
}> => {
    return request.get('/chat/get-list-chat-tag', {
        params,
    });
};

export const apiGetListMessages = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    data: Array<TypeChatMessageResponse>;
}> => {
    return request.get(`/chat/get-list-messages/${params.chatTagId}`, {
        params,
    });
};

export const apiDeleteMessage = (params: TypeDeleteMessageRequest) => {
    return request.put('/chat/delete-message', params);
};

export const apiGetDetailChatTag = (chatTagId: string) => {
    return request.get(`/chat/get-detail-chat-tag/${chatTagId}`);
};

/**
 *  SETTING
 */
export const apiChangeLanguage = (newLanguage: number) => {
    return request.put('/setting/extend/change-language', {
        newLanguage,
    });
};
export const apiChangeTheme = (newTheme: number) => {
    return request.put('/setting/extend/change-theme', {
        newTheme,
    });
};
export const apiChangeDisplayAvatar = (value: boolean) => {
    return request.put('/setting/extend/change-display-avatar', {
        value,
    });
};

export const apiChangePassword = (params: TypeChangePasswordRequest) => {
    return request.put('/setting/security/change-password', params);
};

export const apiBlockUser = (id: number) => {
    return request.post(`/setting/block/enable/${id}`);
};
export const apiUnBlockUser = (id: number) => {
    return request.post(`/setting/block/disable/${id}`);
};
export const apiGetListBlocked = (): Promise<TypeGetListBlockedResponse> => {
    return request.get('/setting/block/get-list');
};

export const apiStopConversation = (chatTagId: string) => {
    return request.put(`/setting/stop-conversation/${chatTagId}`);
};
export const apiOpenConversation = (chatTagId: string) => {
    return request.put(`/setting/open-conversation/${chatTagId}`);
};

export const apiChangeInformation = (
    body: any,
): Promise<TypeChangeInformationResponse> => {
    return request.put('/setting/change-information', body);
};

/**
 *  PROFILE
 */
export const apiGetProfile = (
    id: number,
): Promise<{
    success: boolean;
    data: TypeGetProfileResponse;
}> => {
    return request.get(`/profile/get-profile/${id}`);
};
export const apiEditProfile = (
    params: TypeEditProfileRequest,
): Promise<TypeEditProfileResponse> => {
    return request.put('/profile/edit-profile', params);
};

export const apiFollowUser = (id: number) => {
    return request.put(`/profile/follow/enable/${id}`);
};
export const apiUnFollowUser = (id: number) => {
    return request.put(`/profile/follow/disable/${id}`);
};

export const apiCreatePost = (
    params: TypeCreatePostRequest,
): Promise<{
    success: boolean;
    data: TypeCreatePostResponse;
}> => {
    return request.post('/profile/create-post', params);
};

export const apiEditPost = (params: {idPost: string; newContent: string}) => {
    return request.put(`/profile/edit-post/${params.idPost}`, {
        content: params.newContent,
    });
};

export const apiDeletePost = (idPost: string) => {
    return request.put(`/profile/delete-post/${idPost}`);
};

export const apiGetListPost = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    data: Array<TypeCreatePostResponse>;
}> => {
    return request.get(`/profile/list-posts/${params.userId}`, {
        params,
    });
};

export const apiLikePost = (idPost: string) => {
    return request.put(`/profile/like-post/${idPost}`);
};
export const apiUnLikePost = (idPost: string) => {
    return request.put(`/profile/unlike-post/${idPost}`);
};

export const apiGetListFollow = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/follow/get-list/${params.userId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
            typeFollow: params.typeFollow,
        },
    });
};

// export const apiRequestPublicChat = (chatTagId: string) => {
//     return request.put(`/chat/request-public/${chatTagId}`);
// };

// export const apiAgreePublicChat = (chatTagId: string) => {
//     return request.put(`/chat/agree-request-public/${chatTagId}`);
// };

// export const apiHandleChatTag = (params: TypeChatTagRequest) => {
//     return request.post('/chat/handle-chat-tag', params);
// };

// export const apiHandleChatTagEnjoy = (params: TypeChatTagEnjoyRequest) => {
//     return request.post('/chat/handle-chat-tag-enjoy', params);
// };
// export const apiHandleBubble = (params: TypeMyBubbles) => {
//     return request.post('/chat/handle-bubble-palace', params);
// };
// export const apiHandleBubbleEnjoy = (params: {
//     myId: string;
//     bubble: TypeMyBubbles;
// }) => {
//     return request.post('/chat/handle-bubble-palace-enjoy', params);
// };

// export const apiChangeGroupName = (params: {
//     newName: string;
//     chatTag: string;
// }) => {
//     return request.put(`/chat/change-group-name/${params.chatTag}`, {
//         name: params.newName,
//     });
// };
