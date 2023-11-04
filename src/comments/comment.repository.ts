import {CommentEntity} from "./Comment.entity";

export interface CommentRepository {
    findCommentWithUser(commentId: number): Promise<CommentEntity | null>

    save(comment: CommentEntity): Promise<CommentEntity>

    remove(comment:CommentEntity): Promise<CommentEntity>
}