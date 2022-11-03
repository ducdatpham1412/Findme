import {TypeParamsPaging} from './interface';
import {TypeCreatePurchaseRequest} from './interface/profile';
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

export const apiGetListReviewAboutUser = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/list-posts-review-user/${params.userId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
        },
    });
};

export const apiCreatePurchaseHistory = (body: TypeCreatePurchaseRequest) => {
    return request.post('/profile/create-purchase-history', body);
};

export const apiCreateErrorLog = (error: string) => {
    return request.post('/profile/create-error-log', {
        error,
    });
};

export const apiDeleteGroupBooking = (postId: string) => {
    return request.put(`/profile/delete-group-buying/${postId}`);
};
