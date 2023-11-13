import {Injectable} from "@nestjs/common";
import {CommentRepository} from "./comment.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "./Comment.entity";
import {Repository} from "typeorm";
import {PostEntity} from "../posts/Post.entity";

@Injectable()
export class TypeormCommentRepository implements CommentRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {
    }

    async findCommentWithUser(commentId: number): Promise<CommentEntity | null> {
        return await this.commentRepository.findOne({
            where: {id: commentId},
            relations: ['user']
        })
    }

    async findAllByPost(post: PostEntity): Promise<CommentEntity[]> {
        return await this.commentRepository.find(
            {
                where: {post: post}
            }
        );
    }

    async save(comment: CommentEntity): Promise<CommentEntity> {
        return await this.commentRepository.save(comment);
    }

    async remove(comment: CommentEntity): Promise<CommentEntity> {
        return await this.commentRepository.remove(comment);
    }
}