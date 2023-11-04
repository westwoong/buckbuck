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

    async findPostWithUser(postId: number): Promise<PostEntity | null> {
        return await this.postRepository.findOne({
            where: {id: postId},
            relations: ['user']
        })
    }

    async findOneById(postId: number): Promise<PostEntity | null> {
        return await this.postRepository.findOne({
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