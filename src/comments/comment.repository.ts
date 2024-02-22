import {CommentEntity} from "./Comment.entity";
import {PostEntity} from "../posts/Post.entity";

export interface CommentRepository {
    getCommentByPostIdSortedDescending(postId: number, page: number): Promise<CommentEntity[] | null>

    findCommentWithUser(commentId: number): Promise<CommentEntity | null>

    findAllByPost(post: PostEntity): Promise<CommentEntity[]>

    save(comment: CommentEntity): Promise<CommentEntity>

    removeOne(comment: CommentEntity): Promise<CommentEntity>

    removeAll(comment: CommentEntity[]): Promise<CommentEntity[]>
}