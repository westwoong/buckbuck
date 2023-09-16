import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {Repository} from "typeorm";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {Transactional} from "typeorm-transactional";
import {request} from "express";
import {UserEntity} from "../users/User.entity";
import {CreatePostResponseDto} from "./dto/createPost.response.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
    }

    @Transactional()
    async create(createPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = createPostRequestDto;
        const post = new PostEntity({title, content, cost, level});
        const user = await this.userRepository.findOne({
            where: {
                id: 3
            }
        }); // 또는 해당 사용자를 찾는 적절한 방법 사용
        if (user) {
            post.user = user;
        }

        await this.postRepository.save(post);

        return new CreatePostResponseDto(post);
    }
}
