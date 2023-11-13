import {PostEntity} from "./Post.entity";

export interface PostRepository {
    findPostWithUserByPostId(postId: number): Promise<PostEntity | null>

    findOneById(postId: number): Promise<PostEntity | null>

    save(post: PostEntity): Promise<PostEntity>

    remove(post: PostEntity): Promise<PostEntity>
}