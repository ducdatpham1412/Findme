import {TypeParamsPaging} from './interface';
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

export const apiArchivePost = (idPost: string) => {
    return request.put(`/profile/archive-post/${idPost}`);
};

export const apiUnArchivePost = (idPost: string) => {
    return request.put(`/profile/un-archive-post/${idPost}`);
};

export const apiGetListGroupBuying = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/list-group-buying/${params.userId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
        },
    });
};
