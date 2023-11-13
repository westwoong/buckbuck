import {BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {Repository} from "typeorm";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {Transactional} from "typeorm-transactional";
import {CreatePostResponseDto} from "./dto/createPost.response.dto";
import {CommentEntity} from "../comments/Comment.entity";
import {POST_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {UserRepository} from "../users/user.repository";
import {PostRepository} from "./post.repository";

@Injectable()
export class PostService {
    constructor(
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {
    }

    @Transactional()
    async create(userId: number, createPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = createPostRequestDto;
        const post = new PostEntity({title, content, cost, level});
        const foundUser = await this.userRepository.findOneById(userId);
        if (!foundUser) throw new BadRequestException('사용자가 존재하지 않습니다.');
        post.user = foundUser;

        await this.postRepository.save(post);

        return new CreatePostResponseDto(post);
    }

    @Transactional()
    async delete(userId: number, postId: number) {
        const post = await this.postRepository.findPostWithUserByPostId(postId);

        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');

        if (post.user.id !== userId) throw new ForbiddenException('본인의 게시글만 삭제가 가능합니다.');

        const comments = await this.commentRepository.find({
                where: {post: post}
            })
        ;

        await this.commentRepository.remove(comments);
        await this.postRepository.remove(post);
    }

    @Transactional()
    async modify(userId: number, postId: number, modifyPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = modifyPostRequestDto;
        const post = await this.postRepository.findPostWithUserByPostId(postId);

        const foundUser = await this.userRepository.findOneById(userId);

        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');
        if (!foundUser) throw new BadRequestException('사용자가 존재하지 않습니다.');
        if (post.user.id !== userId) throw new ForbiddenException('본인의 게시글만 수정 가능합니다.')

        post.title = title;
        post.content = content;
        post.cost = cost;
        post.level = level;

        await this.postRepository.save(post);

        return
    }
}
