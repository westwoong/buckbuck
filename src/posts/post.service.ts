import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {Repository} from "typeorm";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {Transactional} from "typeorm-transactional";
import {UserEntity} from "../users/User.entity";
import {CreatePostResponseDto} from "./dto/createPost.response.dto";
import {CommentEntity} from "../comments/Comment.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {
    }

    @Transactional()
    async create(userId: UserEntity, createPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = createPostRequestDto;
        const post = new PostEntity({title, content, cost, level});
        post.user = userId;


        await this.postRepository.save(post);

        return new CreatePostResponseDto(post);
    }

    @Transactional()
    async delete(postId: number) {
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');

        const comments = await this.commentRepository.find({
                where: {
                    post: post
                }
            })
        ;

        await this.commentRepository.remove(comments);
        await this.postRepository.remove(post);
    }

    @Transactional()
    async modify(postId: number, modifyPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = modifyPostRequestDto;
        const post = await this.postRepository.findOne({
            where: {id: postId},
        });
        if (!post) {
            throw new NotFoundException('해당 게시글은 존재하지 않습니다.');
        }
        post.title = title;
        post.content = content;
        post.cost = cost;
        post.level = level;

        await this.postRepository.save(post);

        return
    }
}
