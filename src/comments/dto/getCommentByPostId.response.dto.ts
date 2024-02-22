import {CommentEntity} from "../Comment.entity";

export class GetCommentByPostIdResponseDto {
    comments: Array<{
        nickName: string,
        proposalCost: number,
        content: string,
        createdAt: Date,
    }>

    constructor(comments: CommentEntity[]) {
        this.comments = comments.map(comment => ({
            nickName: comment.user.nickName,
            proposalCost: comment.proposalCost,
            content: comment.content,
            createdAt: comment.createdAt
        }))
    }
}