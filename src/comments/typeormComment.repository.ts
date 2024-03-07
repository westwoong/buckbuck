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

    async getCommentByPostIdSortedDescending(postId: number, page: number): Promise<CommentEntity[] | null> {
        let limit = 25;
        let skip = (page - 1) * limit;
        return await this.commentRepository.find({
            relations: ['user'],
            order: {createdAt: 'DESC'},
            where: {postId},
            take: limit,
            skip: skip
        })
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

    async removeOne(comment: CommentEntity): Promise<CommentEntity> {
        return await this.commentRepository.remove(comment);
    }

    async removeAll(comment: CommentEntity[]): Promise<CommentEntity[]> {
        return await this.commentRepository.remove(comment);
    }
}