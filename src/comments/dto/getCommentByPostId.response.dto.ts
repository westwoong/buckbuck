import {CommentEntity} from "../Comment.entity";
import {ApiProperty} from "@nestjs/swagger";

export class GetCommentsByPostIdResponseDto {
    @ApiProperty({
        description: '검색한 게시글에 작성되어있는 댓글 목록',
        example: [
            {
                nickName: '테스터',
                proposalCost: 15000,
                content: '제안 댓글입니다.',
                createdAt: '1111-01-11T11:11:11.000Z'
            },
            {
                nickName: '테스ter132',
                proposalCost: 25000,
                content: '두번 째 제안 댓글입니다.',
                createdAt: '1111-01-11T11:20:20.000Z'
            }
        ],
        required: true,
        isArray: true,
        maxItems: 50,
        type: 'array',
    })
    comments: Array<{
        nickName: string,
        proposalCost: number,
        content: string,
        createdAt: Date,
    }>

    constructor(comments: CommentEntity[] | null) {
        this.comments = comments ? comments.map(comment => ({
            nickName: comment.user.nickName,
            proposalCost: comment.proposalCost,
            content: comment.content,
            createdAt: comment.createdAt
        })) : [];
    }
}