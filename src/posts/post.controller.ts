import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Patch,
    Request,
    Post,
    UseGuards,
} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {UserIdRequest} from "../common/userId.request.interface";

@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) {
    }

    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    create(@Request() req: UserIdRequest, @Body() createPostRequestDto: CreatePostRequestDto) {
        const userId = req.user.userId;
        return this.postService.create(userId, createPostRequestDto);

    }

    @Delete(':postId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    delete(
        @Request() req: UserIdRequest,
        @Param('postId') postId: string
    ) {
        const userId = req.user.userId;
        const parsedPostId = parseInt(postId);
        return this.postService.delete(userId, parsedPostId);
    }

    @Patch(':postId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    modify(
        @Request() req: UserIdRequest,
        @Param('postId') postId: string,
        @Body() modifyPostRequestDto: CreatePostRequestDto
    ) {
        const userId = req.user.userId;
        const parsedPostId = parseInt(postId);
        return this.postService.modify(userId, parsedPostId, modifyPostRequestDto)
    }
}
