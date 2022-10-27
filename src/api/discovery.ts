import {
    TypeCreateGroupBuying,
    TypeEditGroupBooking,
    TypeJoinGroupBookingRequest,
} from 'api/interface/discovery';
import {TypeParamsPaging} from './interface';
import request from './request';

export const apiJoinGroupBuying = (params: TypeJoinGroupBookingRequest) => {
    return request.put(`/profile/join-group-buying/${params.postId}`, {
        money: params.money,
        amount: params.amount,
        time_will_buy: params.time_will_buy,
        note: params.note,
        is_retail: params.is_retail,
    });
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

export const apiEditGroupBooking = (body: TypeEditGroupBooking) => {
    return request.put(`profile/edit-group-buying/${body.postId}`, {
        topic: body.topic,
        content: body.content,
        is_public_from_draft: body.is_public_from_draft,
    });
};

export const apiGetTopGroupBuying = () => {
    return request.get('/common/get-top-group-buying');
};
