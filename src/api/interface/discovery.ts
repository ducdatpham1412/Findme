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
