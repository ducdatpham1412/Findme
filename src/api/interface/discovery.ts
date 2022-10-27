export type TypeShowModalCommentOrLike = 'comment' | 'like';

export interface TypePeopleJoinedResponse {
    id: string;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string;
    status: number | null;
    relationship: number | null;
}

export interface TypePrice {
    number_people: number;
    value: string;
}

export interface TypeCreateGroupBuying {
    topic: Array<number>;
    content: string;
    images: Array<string>;
    deadlineDate: string;
    startDate: string;
    endDate: string;
    retailPrice: string;
    prices: Array<TypePrice>;
    maxGroups: number;
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
