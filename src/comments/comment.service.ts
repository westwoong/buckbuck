import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "./Comment.entity";
import {Repository} from "typeorm";
import {CreateCommentRequestDto} from "./dto/createComment.request.dto";
import {PostEntity} from "../posts/Post.entity";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {
    }

    @Transactional()
    async create(postId: PostEntity, createCommentRequestDto: CreateCommentRequestDto) {
        const {content, proposalCost} = createCommentRequestDto;
        const comment = new CommentEntity({content, proposalCost});
        comment.post = postId;

        await this.commentRepository.save(comment);

        return comment;
    }

    @Transactional()
    async delete(commentId: number) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId
            }
        })
        if (!comment) throw new NotFoundException('해당 댓글은 존재하지않습니다')
        await this.commentRepository.remove(comment);
    }

}
