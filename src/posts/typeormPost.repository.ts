import {Injectable} from "@nestjs/common";
import {PostRepository} from "./post.repository";
import {PostEntity} from "./Post.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class TypeormPostRepository implements PostRepository {

    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
    ) {
    }

    async getPostsSortedDescending(page: number): Promise<PostEntity[]> {
        let limit = 25;
        const skip = (page - 1) * limit
        return await this.postRepository.find({
            relations: ['user', 'comment'],
            order: {createdAt: 'DESC'},
            take: limit,
            skip: skip
        })
    }

    async findPostWithUserByPostId(postId: number): Promise<PostEntity | null> {
        return await this.postRepository.findOne({
            where: {id: postId},
            relations: ['user']
        })
    }

    async findOneById(postId: number): Promise<PostEntity | null> {
        return await this.postRepository.findOne({
            relations: ['user', 'comment', 'comment.user', 'uploadFile'],
            order: {createdAt: 'DESC'},
            where: {id: postId}
        })
    }

    async save(post: PostEntity) {
        return await this.postRepository.save(post);
    }

    async remove(post: PostEntity): Promise<PostEntity> {
        return await this.postRepository.remove(post);
    }
}