import {PostEntity} from "../Post.entity";
import {format} from "date-fns";

export class GetPostsResponseDto {
    posts: Array<{
        id: number;
        createdAt: string;
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
            createdAt: format(post.createdAt, 'yyyy-MM-dd HH:mm:ss'),
            commentCount: post.comment.length
        }));
    }
}