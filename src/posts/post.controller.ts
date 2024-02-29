import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Patch,
    Request,
    Post,
    UseGuards, Get, Query, ParseIntPipe,
} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {UserIdRequest} from "../common/userId.request.interface";
import {ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetPostsResponseDto} from "./dto/getPosts.response.dto";
import {CreatePostResponseDto} from "./dto/createPost.response.dto";

@ApiTags('게시글 API')
@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) {
    }

    @Get()
    @ApiOperation({summary: '전체 게시글 조회 API', description: '전체 게시글을 조회한다.'})
    @ApiResponse({status: 200, description: '게시글 목록을 반환한다.', type: GetPostsResponseDto})
    @ApiQuery({
        name: 'page',
        description: 'pagiNation 값을 입력한다',
        type: 'number'
    })
    @HttpCode(200)
    getPosts(@Query('page', ParseIntPipe) page: number) {
        return this.postService.getPosts(page);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({summary: '게시글 작성 API', description: '게시글을 작성한다.'})
    @ApiResponse({status: 201, description: '작성한 게시글을 반환한다', type: CreatePostResponseDto})
    @HttpCode(201)
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    @UseGuards(JwtAuthGuard)
    create(
        @Request() req: UserIdRequest,
        @Body() createPostRequestDto: CreatePostRequestDto
    ) {
        const userId = req.user.userId;
        return this.postService.create(userId, createPostRequestDto);
    }

    @Delete(':postId')
    @ApiBearerAuth()
    @ApiOperation({summary: '게시글 삭제 API', description: '게시글을 삭제한다.'})
    @ApiResponse({status: 204, description: 'No Content'})
    @ApiParam({
        name: 'postId',
        description: '게시글 번호',
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
        @Param('postId', ParseIntPipe) postId: number
    ) {
        const userId = req.user.userId;
        return this.postService.delete(userId, postId);
    }

    @Patch(':postId')
    @ApiBearerAuth()
    @ApiOperation({summary: '게시글 수정 API', description: '게시글을 수정한다.'})
    @ApiResponse({status: 200, description: 'No Content'})
    @ApiParam({
        name: 'postId',
        description: '게시글 번호',
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
        @Param('postId', ParseIntPipe) postId: number,
        @Body() modifyPostRequestDto: CreatePostRequestDto
    ) {
        const userId = req.user.userId;
        return this.postService.modify(userId, postId, modifyPostRequestDto)
    }
}
