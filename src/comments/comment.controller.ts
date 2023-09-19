import {Body, Controller, Delete, HttpCode, Param, Patch, Post} from '@nestjs/common';
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

    @Delete(':commentId')
    @HttpCode(204)
    delete(@Param('commentId') commentId: string) {
        const parsedCommentId = parseInt(commentId);
        return this.commentService.delete(parsedCommentId);
    }

    @Patch(':commentId')
    @HttpCode(200)
    modify(@Param('commentId') commentId: string,
           @Body() modifyCommentRequestDto: CreateCommentRequestDto) {
        const parsedCommentId = parseInt(commentId);
        return this.commentService.modify(parsedCommentId, modifyCommentRequestDto);
    }
}
