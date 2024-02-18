import {Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import {CommentService} from "./comment.service";
import {CreateCommentRequestDto} from "./dto/createComment.request.dto";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {UserIdRequest} from "../common/userId.request.interface";

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post(':postId')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    create(
        @Request() req: UserIdRequest,
        @Param('postId') postId: string,
        @Body() createCommentRequestDto: CreateCommentRequestDto) {
        const userId = req.user.userId;
        const parsedPostId = parseInt(postId);
        return this.commentService.create(userId, parsedPostId, createCommentRequestDto);

    }

    @Delete(':commentId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    delete(
        @Request() req: UserIdRequest,
        @Param('commentId') commentId: string) {
        const userId = req.user.userId;
        const parsedCommentId = parseInt(commentId);
        return this.commentService.delete(userId, parsedCommentId);
    }

    @Patch(':commentId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    modify(
        @Request() req: UserIdRequest,
        @Param('commentId') commentId: string,
        @Body() modifyCommentRequestDto: CreateCommentRequestDto) {
        const userId = req.user.userId;
        const parsedCommentId = parseInt(commentId);
        return this.commentService.modify(userId, parsedCommentId, modifyCommentRequestDto);
    }

    @Get(':commentId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    search(@Param('commentId') commentId: string) {
        const parsedCommentId = parseInt(commentId)
        return this.commentService.searchByCommentId(parsedCommentId);
    }
}
