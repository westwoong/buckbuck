import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "./Comment.entity";
import {Repository} from "typeorm";
import {CreateCommentRequestDto} from "./dto/createComment.request.dto";
import {PostEntity} from "../posts/Post.entity";

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {
    }

    async create(postId: PostEntity, createCommentRequestDto: CreateCommentRequestDto) {
        const comment = new CommentEntity(createCommentRequestDto);
        comment.post = postId;

        await this.commentRepository.save(comment);

        return comment;
    }
}
