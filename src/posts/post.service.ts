import {BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {PostEntity} from "./Post.entity";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {Transactional} from "typeorm-transactional";
import {CreatePostResponseDto} from "./dto/createPost.response.dto";
import {COMMENT_REPOSITORY, POST_REPOSITORY, UPLOAD_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {UserRepository} from "../users/user.repository";
import {PostRepository} from "./post.repository";
import {CommentRepository} from "../comments/comment.repository";
import {GetPostsResponseDto} from "./dto/getPosts.response.dto";
import {GetPostResponseDto} from "./dto/getPost.response.dto";
import {UploadRepository} from "../uploads/upload.repository";

@Injectable()
export class PostService {
    constructor(
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: CommentRepository,
        @Inject(UPLOAD_REPOSITORY)
        private readonly uploadRepository: UploadRepository
    ) {
    }

    async getPosts(page: number) {
        if (!page) throw new BadRequestException('page 값이 존재하지 않습니다.');
        const posts = await this.postRepository.getPostsSortedDescending(page);
        return new GetPostsResponseDto(posts);
    }

    async getPostById(postId: number) {
        const post = await this.postRepository.findOneById(postId);
        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');
        return new GetPostResponseDto(post);
    }

    @Transactional()
    async create(userId: number, createPostRequestDto: CreatePostRequestDto) {
        const {title, content, images, cost, level} = createPostRequestDto;
        const post = new PostEntity({title, content, cost, level, userId});

        const writePost = await this.postRepository.save(post);

        if (images) await this.matchImagesToPostId(images, writePost.id)

        return new CreatePostResponseDto(writePost);
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

    @Transactional()
    async matchImagesToPostId(images: Array<string>, postId: number) {
        for (const url of images) {
            const isExistImage = await this.uploadRepository.findOneByUrl(url)
            if (!isExistImage) throw new NotFoundException('해당 이미지는 존재하지 않습니다.');

            await this.uploadRepository.matchToPostId(url, postId);
        }
    }
}
