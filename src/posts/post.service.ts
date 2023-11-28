import {ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {PostEntity} from "./Post.entity";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {Transactional} from "typeorm-transactional";
import {CreatePostResponseDto} from "./dto/createPost.response.dto";
import {COMMENT_REPOSITORY, POST_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {UserRepository} from "../users/user.repository";
import {PostRepository} from "./post.repository";
import {CommentRepository} from "../comments/comment.repository";

@Injectable()
export class PostService {
    constructor(
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: CommentRepository
    ) {
    }

    @Transactional()
    async create(userId: number, createPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = createPostRequestDto;
        const post = new PostEntity({title, content, cost, level, userId});

        await this.postRepository.save(post);

        return new CreatePostResponseDto(post);
    }

    @Transactional()
    async delete(userId: number, postId: number) {
        const post = await this.postRepository.findPostWithUserByPostId(postId);

        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');

        if (post.userId !== userId) throw new ForbiddenException('본인의 게시글만 삭제가 가능합니다.');

        const comments = await this.commentRepository.findAllByPost(post);

        await this.commentRepository.removeAll(comments);
        await this.postRepository.remove(post);
    }

    @Transactional()
    async modify(userId: number, postId: number, modifyPostRequestDto: CreatePostRequestDto) {
        const {title, content, cost, level} = modifyPostRequestDto;
        const post = await this.postRepository.findPostWithUserByPostId(postId);

        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');

        if (post.userId !== userId) throw new ForbiddenException('본인의 게시글만 수정 가능합니다.')

        post.title = title;
        post.content = content;
        post.cost = cost;
        post.level = level;

        await this.postRepository.save(post);

        return
    }
}
