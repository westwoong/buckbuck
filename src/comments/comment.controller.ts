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
import {ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateCommentResponseDto} from "./dto/createComment.response.dto";
import {GetCommentByPostIdResponseDto} from "./dto/getCommentByPostId.response.dto";
import {SearchCommentResponseDto} from "./dto/searchComment.response.dto";

@ApiTags('댓글 API')
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post(':postId')
    @ApiBearerAuth()
    @ApiOperation({summary: '댓글 작성 API', description: '게시글에 댓글을 작성한다.'})
    @ApiResponse({status: 201, description: '작성한 댓글을 보여준다', type: CreateCommentResponseDto})
    @ApiParam({
        name: 'postId',
        description: '댓글을 작성할 postId 값을 입력한다',
        type: 'number'
    })
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
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
    @ApiBearerAuth()
    @ApiOperation({summary: '댓글 삭제 API', description: '댓글을 삭제한다.'})
    @ApiResponse({status: 204, description: 'No Content'})
    @ApiParam({
        name: 'commentId',
        description: '삭제할 commentId 값을 입력한다',
        type: 'number'
    })
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    delete(
        @Request() req: UserIdRequest,
        @Param('commentId', ParseIntPipe) commentId: number) {
        const userId = req.user.userId;
        return this.commentService.delete(userId, commentId);
    }

    @Patch(':commentId')
    @ApiBearerAuth()
    @ApiOperation({summary: '댓글 수정 API', description: '댓글을 수정한다.'})
    @ApiResponse({status: 200, description: 'No Content'})
    @ApiParam({
        name: 'commentId',
        description: '수정할 commentId 값을 입력한다',
        type: 'number'
    })
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
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
    @ApiBearerAuth()
    @ApiOperation({summary: '댓글 검색 API', description: '해당 댓글 1개를 검색한다'})
    @ApiResponse({status: 200, description: '검색한 댓글을 반환한다.', type: SearchCommentResponseDto})
    @ApiParam({
        name: 'commentId',
        description: '조회할 commentId 값을 입력한다',
        type: 'number'
    })
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    search(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.searchByCommentId(commentId);
    }

    @Get('/post/:postId')
    @ApiOperation({summary: '댓글 조회 API', description: '해당 게시글의 댓글들을 조회한다.'})
    @ApiResponse({status: 200, description: '게시글에 달린 댓글을 반환한다.', type: GetCommentByPostIdResponseDto})
    @ApiParam({
        name: 'postId',
        description: '댓글을 조회할 postId 값을 입력한다',
        type: 'number'
    })
    @ApiQuery({
        name: 'commentPage',
        description: 'pagiNation 값을 입력한다.',
        type: 'number'
    })
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    searchCommentByPostId(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('commentPage', ParseIntPipe) commentPage: number,
    ) {
        return this.commentService.searchCommentByPostId(postId, commentPage);
    }
}
