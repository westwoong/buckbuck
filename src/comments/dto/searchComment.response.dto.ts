import {CommentEntity} from "../Comment.entity";
import {ApiProperty} from "@nestjs/swagger";

export class SearchCommentResponseDto {
    @ApiProperty({
        description: '검색한 댓글의 응답 값',
        example: {
            id: 1,
            postId: 10,
            nickName: '테스터',
            proposalCost: 15000,
            content: '제안 댓글입니다.',
            createdAt: '2222-02-22T10:10:22.000Z',
            updatedAt: '2222-02-22T210:22:33.000Z',
        },
        required: true
    })
    comment: {
        id: number,
        postId: number,
        proposalCost: number,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        nickName: string,
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