import {PostEntity} from "../Post.entity";

export class GetPostsResponseDto {
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
            createdAt: post.createdAt,
            title: post.title,
            content: post.content,
            cost: post.cost,
            level: post.level,
            nickName: post.user.nickName,
            commentCount: post.comment.length
        }));
    }
}