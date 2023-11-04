import {PostEntity} from "./Post.entity";

export interface PostRepository {
    findPostWithUser(postId: number): Promise<PostEntity | null>

    findOneByPostId(postId: number): Promise<PostEntity | null>

    remove(post: PostEntity): Promise<PostEntity>
}