import {PostEntity} from "./Post.entity";

export interface PostRepository {
    findPostWithUser(postId: number): Promise<PostEntity | null>

    findOneById(postId: number): Promise<PostEntity | null>

    remove(post: PostEntity): Promise<PostEntity>
}