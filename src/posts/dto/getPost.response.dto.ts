import {PostEntity} from "../Post.entity";
import {ApiProperty} from "@nestjs/swagger";

export class GetPostResponseDto {
    @ApiProperty({
        description: '특정 게시글 조회 반환 값',
        example: {
            id: 1,
            title: '테스트 제목입니다.',
            content: '테스트 내용입니다.',
            cost: 10500,
            level: '고수',
            nickName: '빨리점11',
            createdAt: '2024-03-01T06:01:26.000Z',
            commentCount: 1,
            comments: [
                {
                    id: 1,
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000,
                    nickName: '빨리점11',
                    createdAt: '2024-03-01T06:10:00.000Z',
                },
                {
                    id: 2,
                    content: '두번 째 테스트 댓글 달아봅니다.',
                    proposalCost: 25000,
                    nickName: '빨리점22',
                    createdAt: '2024-03-01T06:22:26.000Z',
                },
            ]
        }
    })
    post: {
        id: number,
        title: string,
        content: string,
        cost: number,
        level: string,
        nickName: string
        createdAt: Date,
        commentCount: number,
        comments: Array<{
            id: number,
            content: string,
            proposalCost: number,
            nickName: string,
            createdAt: Date
        }>
    }

    constructor(post: PostEntity) {
        this.post = {
            id: post.id,
            title: post.title,
            content: post.content,
            cost: post.cost,
            level: post.level,
            nickName: post.user.nickName,
            createdAt: post.createdAt,
            commentCount: post.comment.length,
            comments: post.comment.map(comment => ({
                id: comment.id,
                content: comment.content,
                proposalCost: comment.proposalCost,
                nickName: comment.user.nickName,
                createdAt: comment.createdAt
            })),
        }
    }
}