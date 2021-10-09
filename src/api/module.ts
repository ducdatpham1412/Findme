import {
    TypeChangeInformationResponse,
    TypeChangePasswordRequest,
    TypeChatMessageResponse,
    TypeChatTagResponse,
    TypeCheckOTPRequest,
    TypeCheckOTPResponse,
    TypeEditProfileRequest,
    TypeEditProfileResponse,
    TypeGetListBlockedResponse,
    TypeGetPassportResponse,
    TypeGetProfileResponse,
    TypeLoginRequest,
    TypeLoginResponse,
    TypeRegisterReq,
    TypeRegisterRes,
    TypeRequestOTPRequest,
    TypeRequestOTPResponse,
    TypeResetPasswordRequest,
    TypeResetPasswordResponse,
    TypeResourceResponse,
    TypeUpdateMyBubblesRequest,
} from './interface';
import request from './request';

// SOCKET
export const getAllListMessage = (id: number) => {};

// OTP
export const apiRequestOTP = (
    params: TypeRequestOTPRequest,
): Promise<TypeRequestOTPResponse> => {
    return request.post('auth/request-otp', params);
};
export const apiCheckOTP = (
    params: TypeCheckOTPRequest,
): Promise<TypeCheckOTPResponse> => {
    return request.post('auth/check-otp', params);
};

/**
 *  AUTHENTICATION
 */
export const apiLogin = (
    params: TypeLoginRequest,
): Promise<TypeLoginResponse> => {
    return request.post('auth/login', params);
};

export const apiRegister = (
    params: TypeRegisterReq,
): Promise<TypeRegisterRes> => {
    return request.post('auth/register', params);
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

/**
 *  COMMON
 */
export const apiGetPassport = (): Promise<TypeGetPassportResponse> => {
    return request.get('common/get-passpost');
};

export const apiGetResource = (): Promise<TypeResourceResponse> => {
    return request.get('common/get-resource');
};

/**
 *  DISCOVERY and CHAT
 */
export const apiGetListChatTags = (): Promise<{
    success: boolean;
    data: Array<TypeChatTagResponse>;
}> => {
    return request.get('chat/get-list-chat-tag');
};

export const apiGetListMessages = (
    chatTagId: string,
): Promise<{
    success: boolean;
    data: Array<TypeChatMessageResponse>;
}> => {
    return request.get(`chat/get-list-messages/${chatTagId}`);
};

export const apiRequestPublicChat = (chatTagId: number) => {
    return request.put(`chat/request-public/${chatTagId}`);
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
    return request.put('/setting/change-password', params);
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

export const apiChangeInformation = (
    body: any,
): Promise<TypeChangeInformationResponse> => {
    return request.put('setting/change-information', body);
};

/**
 *  PROFILE
 */
export const apiGetProfile = (id: number): Promise<TypeGetProfileResponse> => {
    return request.get(`/profile/get-profile/${id}`);
};
export const apiEditProfile = (
    params: TypeEditProfileRequest,
): Promise<TypeEditProfileResponse> => {
    return request.put('profile/edit-profile', params);
};

export const apiFollowUser = (id: number) => {
    return request.put(`/profile/follow/enable/${id}`);
};
export const apiUnFollowUser = (id: number) => {
    return request.put(`/profile/follow/disable/${id}`);
};

export const apiUpdateMyBubbles = (params: TypeUpdateMyBubblesRequest) => {
    return request.put('/common/update-my-bubbles', params.list);
};

/**
 *  COMMON
 */
export const apiUploadImage = (formData: any) =>
    request.post('common/upload-image', formData);
