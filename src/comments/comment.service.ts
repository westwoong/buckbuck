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

@Injectable()
export class CommentService {

    constructor(
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository2: CommentRepository,
        @Inject(POST_REPOSITORY)
        private readonly postRepository2: PostRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository2: UserRepository
    ) {
    }

    @Transactional()
    async create(userId: number, postId: number, createCommentRequestDto: CreateCommentRequestDto) {
        const {content, proposalCost} = createCommentRequestDto;
        const user = await this.userRepository2.findOneById(userId);
        const post = await this.postRepository2.findOneById(postId);

        if (!user) throw new BadRequestException('잘못된 접근입니다.')
        if (!post) throw new NotFoundException('해당 게시글은 존재하지 않습니다.');

        const comment = new CommentEntity({content, proposalCost});
        comment.post = post;
        comment.user = user;

        await this.commentRepository2.save(comment);

        return new CreateCommentResponseDto(comment);
    }

    @Transactional()
    async delete(userId: number, commentId: number) {
        const comment = await this.commentRepository2.findCommentWithUser(commentId);

        if (!comment) throw new NotFoundException('해당 댓글은 존재하지않습니다')
        if (comment.user.id !== userId) throw new ForbiddenException('본인의 댓글만 삭제가 가능합니다.')
        await this.commentRepository2.remove(comment);
    }

    @Transactional()
    async modify(userId: number, commentId: number, modifyCommentRequestDto: CreateCommentRequestDto) {
        const {content, proposalCost} = modifyCommentRequestDto;
        const user = await this.userRepository2.findOneById(userId);
        const comment = await this.commentRepository2.findCommentWithUser(commentId);

        if (!user) throw new BadRequestException('잘못된 접근입니다.')
        if (!comment) throw new NotFoundException('해당 댓글은 존재하지않습니다')
        if (comment.user.id !== userId) throw new ForbiddenException('본인의 댓글만 수정이 가능합니다.')

        comment.content = content;
        comment.proposalCost = proposalCost;

        await this.commentRepository2.save(comment);
        return
    }
}
