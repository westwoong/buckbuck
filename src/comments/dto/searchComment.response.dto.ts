import {CommentEntity} from "../Comment.entity";

export class SearchCommentResponseDto {
    comment: {
        id: number,
        postId: number,
        proposalCost: number,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        nickName :string,
    }

    constructor(commentEntity: CommentEntity) {
        this.comment = {
            id: commentEntity.id,
            postId: commentEntity.postId,
            proposalCost: commentEntity.proposalCost,
            content: commentEntity.content,
            createdAt: commentEntity.createdAt,
            updatedAt: commentEntity.updatedAt,
            nickName: commentEntity.user.nickName,
        };
    }
}