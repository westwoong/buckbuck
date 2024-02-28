import {CommentEntity} from "../Comment.entity";

export class SearchCommentResponseDto {
    comment: {
        id: number,
        postId: number,
        proposalCost: number,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        user: {
            nickname: string,
            createdAt: Date,
            updatedAt: Date
        }
    }

    constructor(commentEntity: CommentEntity) {
        this.comment = {
            id: commentEntity.id,
            postId: commentEntity.postId,
            proposalCost: commentEntity.proposalCost,
            content: commentEntity.content,
            createdAt: commentEntity.createdAt,
            updatedAt: commentEntity.updatedAt,
            user: {
                nickname: commentEntity.user.nickName,
                createdAt: commentEntity.user.createdAt,
                updatedAt: commentEntity.user.updatedAt
            }
        };
    }
}