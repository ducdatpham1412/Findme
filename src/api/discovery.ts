import {TypeCreateGroupBuying} from 'api/interface/discovery';
import {TypeParamsPaging} from './interface';
import request from './request';

export const apiJoinGroupBuying = (postId: string) => {
    return request.put(`/profile/join-group-buying/${postId}`);
};

export const apiLeaveGroupBuying = (postId: string) => {
    return request.put(`/profile/leave-group-buying/${postId}`);
};

export const apiGetListPeopleJoined = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/list-people-joined/${params.postId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
        },
    });
};

export const apiConfirmUserBought = (body: {
    post_id: string;
    user_id: number;
}) => {
    return request.put('profile/confirm-user-bought', body);
};

export const apiCreateGroupBuying = (body: TypeCreateGroupBuying) => {
    return request.post('profile/create-group-buying', body);
};

export const apiGetTopGroupBuying = () => {
    return request.get('/common/get-top-group-buying');
};
