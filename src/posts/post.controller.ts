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
import {ApiTags} from "@nestjs/swagger";

@ApiTags('게시글 API')
@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) {
    }

    @Get()
    @HttpCode(200)
    getPosts(@Query('page', ParseIntPipe) page: number) {
        return this.postService.getPosts(page);
    }

    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    create(
        @Request() req: UserIdRequest,
        @Body() createPostRequestDto: CreatePostRequestDto
    ) {
        const userId = req.user.userId;
        return this.postService.create(userId, createPostRequestDto);
    }

    @Delete(':postId')
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
