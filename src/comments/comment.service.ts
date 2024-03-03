import {
    BadRequestException,
    ForbiddenException, Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {CommentEntity} from "./Comment.entity";
import {CreateCommentRequestDto} from "./dto/createComment.request.dto";
import {Transactional} from "typeorm-transactional";
import {CreateCommentResponseDto} from "./dto/createComment.response.dto";
import {COMMENT_REPOSITORY, POST_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {CommentRepository} from "./comment.repository";
import {PostRepository} from "../posts/post.repository";
import {UserRepository} from "../users/user.repository";
import {SearchCommentResponseDto} from "./dto/searchComment.response.dto";
import {GetCommentsByPostIdResponseDto} from "./dto/getCommentByPostId.response.dto";

@Injectable()
export class CommentService {

    constructor(
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: CommentRepository,
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository
    ) {
    }

    @Transactional()
    async create(userId: number, postId: number, createCommentRequestDto: CreateCommentRequestDto) {
        const {content, proposalCost} = createCommentRequestDto;
        const post = await this.postRepository.findOneById(postId);

        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');

        const comment = new CommentEntity({content, proposalCost, userId, postId: post.id});

        await this.commentRepository.save(comment);

        return new CreateCommentResponseDto(comment);
    }

    @Transactional()
    async delete(userId: number, commentId: number) {
        const comment = await this.commentRepository.findCommentWithUser(commentId);

        if (!comment) throw new NotFoundException('해당 댓글은 존재하지않습니다')
        if (comment.userId !== userId) throw new ForbiddenException('본인의 댓글만 삭제가 가능합니다.')
        await this.commentRepository.removeOne(comment);
    }

    @Transactional()
    async modify(userId: number, commentId: number, modifyCommentRequestDto: CreateCommentRequestDto) {
        const {content, proposalCost} = modifyCommentRequestDto;
        const comment = await this.commentRepository.findCommentWithUser(commentId);

        if (!comment) throw new NotFoundException('해당 댓글은 존재하지않습니다')
        if (comment.userId !== userId) throw new ForbiddenException('본인의 댓글만 수정이 가능합니다.')

        comment.content = content;
        comment.proposalCost = proposalCost;

        await this.commentRepository.save(comment);
        return
    }

    async searchByCommentId(commentId: number) {
        const comment = await this.commentRepository.findCommentWithUser(commentId);
        if (!comment) throw new NotFoundException('해당 댓글은 존재하지 않습니다.');
        return new SearchCommentResponseDto(comment);
    }

    async searchCommentByPostId(postId: number, commentPage: number) {
        const post = await this.postRepository.findOneById(postId);
        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');
        if (!commentPage) throw new BadRequestException('page 가 존재하지 않습니다.');

        const comments = await this.commentRepository.getCommentByPostIdSortedDescending(postId, commentPage);

        return new GetCommentsByPostIdResponseDto(comments);
    }
}
