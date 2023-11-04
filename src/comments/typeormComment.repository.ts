import {Injectable} from "@nestjs/common";
import {CommentRepository} from "./comment.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "./Comment.entity";
import {Repository} from "typeorm";

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

    async save(comment: CommentEntity): Promise<CommentEntity> {
        return await this.commentRepository.save(comment);
    }

    async remove(comment: CommentEntity): Promise<CommentEntity> {
        return await this.commentRepository.remove(comment);
    }
}