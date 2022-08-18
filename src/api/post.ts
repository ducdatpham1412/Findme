import request from './request';

export const apiSavePost = (postId: string) => {
    return request.put(`/profile/save-post/${postId}`);
};

export const apiUnSavePost = (postId: string) => {
    return request.put(`/profile/un-save-post/${postId}`);
};

export const apiLikePost = (idPost: string) => {
    return request.put(`/profile/like-post/${idPost}`);
};
export const apiUnLikePost = (idPost: string) => {
    return request.put(`/profile/unlike-post/${idPost}`);
};
