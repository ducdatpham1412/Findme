export type TypeShowModalCommentOrLike = 'comment' | 'like';

export interface TypePeopleJoinedResponse {
    id: string;
    deposit: string | null;
    amount: number | null;
    timeWillBuy: string | null;
    note: string | null;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    creatorPhone: string;
    created: string;
    status: number | null;
    relationship: number | null;
}

export interface TypeGroupPeopleJoined {
    id: string;
    totalMembers: number;
    listPeople: Array<TypePeopleJoinedResponse>;
    created: string;
}

export interface TypePrice {
    number_people: number;
    value: string;
}

export interface TypeCreateGroupBuying {
    topic: Array<number>;
    content: string;
    images: Array<string>;
    retailPrice: string;
    prices: Array<TypePrice>;
    isDraft: boolean;
}

interface TypeResultSearchOk {
    average_stars: number;
    total_reviews: number;
    total_group_bookings: number;
}
export type TypeResultSearch = TypeResultSearchOk | null;

export interface TypeEditGroupBooking {
    postId: string;
    topic: Array<number>;
    content: string;
    is_public_from_draft?: boolean;
    // max_groups: number;
}

export interface TypeJoinGroupBookingRequest {
    postId: string;
    money: string;
    amount: number;
    time_will_buy: string;
    note: string;
    is_retail: boolean;
    productId: string;
}
export interface TypeJoinGbResponse {
    groupId: string | null;
    joinId: string;
}
