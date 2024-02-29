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
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('댓글 API')
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post(':postId')
    @ApiOperation({summary: '댓글 작성 API', description: '댓글을 작성한다.'})
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
    @ApiOperation({summary: '댓글 삭제 API', description: '댓글을 삭제한다.'})
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    delete(
        @Request() req: UserIdRequest,
        @Param('commentId', ParseIntPipe) commentId: number) {
        const userId = req.user.userId;
        return this.commentService.delete(userId, commentId);
    }

    @Patch(':commentId')
    @ApiOperation({summary: '댓글 수정 API', description: '댓글을 수정한다.'})
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
    @ApiOperation({summary: '댓글 검색 API', description: '해당 댓글 1개를 검색한다'})
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    search(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.searchByCommentId(commentId);
    }

    @Get('/post/:postId')
    @ApiOperation({summary: '댓글 조회 API', description: '해당 게시글의 댓글들을 조회한다.'})
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    searchCommentByPostId(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('commentPage', ParseIntPipe) commentPage: number,
    ) {
        return this.commentService.searchCommentByPostId(postId, commentPage);
    }
}
