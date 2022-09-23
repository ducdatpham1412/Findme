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
    prices: Array<TypePrice>;
    isDraft: boolean;
}
