import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
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
        @Param('postId', ParseIntPipe) postId: number,
        @Body() createCommentRequestDto: CreateCommentRequestDto) {
        const userId = req.user.userId;
        return this.commentService.create(userId, postId, createCommentRequestDto);

    }

    @Delete(':commentId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    delete(
        @Request() req: UserIdRequest,
        @Param('commentId', ParseIntPipe) commentId: number) {
        const userId = req.user.userId;
        return this.commentService.delete(userId, commentId);
    }

    @Patch(':commentId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    modify(
        @Request() req: UserIdRequest,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() modifyCommentRequestDto: CreateCommentRequestDto) {
        const userId = req.user.userId;
        return this.commentService.modify(userId, commentId, modifyCommentRequestDto);
    }

    @Get(':commentId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    search(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.searchByCommentId(commentId);
    }

    @Get('/post/:postId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    searchCommentByPostId(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('commentPage', ParseIntPipe) commentPage: number,
    ) {
        return this.commentService.searchCommentByPostId(postId, commentPage);
    }
}
