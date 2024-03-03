import {PostEntity} from "../Post.entity";
import {ApiProperty} from "@nestjs/swagger";

export class GetPostsResponseDto {
    @ApiProperty({
        description: '게시글 조회 데이터',
        example: [
            {
                id: 1,
                title: '제목111',
                content: '내용111',
                cost: 10000,
                level: '초급',
                nickName: '테스터111',
                createdAt: '1111-01-11T11:11:11.000Z',
                commentCount: 11
            },
            {
                id: 2,
                title: '제목222',
                content: '내용222',
                cost: 20000,
                level: '중급',
                nickName: '테스터222',
                createdAt: '2222-02-22T22:22:22.000Z',
                commentCount: 22
            },
        ],
        isArray: true,
        type: 'array',
        maxItems: 50,
        required: true
    })
    posts: Array<{
        id: number;
        createdAt: Date;
        title: string;
        content: string;
        cost: number;
        level: string;
        nickName: string
    }>;

    constructor(posts: PostEntity[]) {
        this.posts = posts.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            cost: post.cost,
            level: post.level,
            nickName: post.user.nickName,
            createdAt: post.createdAt,
            commentCount: post.comment.length
        }));
    }
}