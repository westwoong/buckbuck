import {Body, Controller, HttpCode, Param, Patch, Post} from '@nestjs/common';
import {CommentService} from "./comment.service";
import {CreateCommentRequestDto} from "./dto/createComment.request.dto";
import {PostEntity} from "../posts/Post.entity";

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post(':postId')
    @HttpCode(201)
    create(
        @Param('postId') postId: PostEntity,
        @Body() createCommentRequestDto: CreateCommentRequestDto) {
        return this.commentService.create(postId, createCommentRequestDto);

    }
}
