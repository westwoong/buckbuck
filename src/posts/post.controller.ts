import {Body, Controller, Delete, HttpCode, Param, Patch, Request, Post, UseGuards} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {UserEntity} from "../users/User.entity";

@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(201)
    create(@Request() req: any, @Body() createPostRequestDto: CreatePostRequestDto) {
        const userId = req.user.userId;
        return this.postService.create(userId, createPostRequestDto);

    }

    @Delete(':postId')
    @HttpCode(204)
    delete(@Param('postId') postId: string) {
        const parsedPostId = parseInt(postId);
        return this.postService.delete(parsedPostId);
    }

    @Patch(':postId')
    @HttpCode(200)
    modify(@Param('postId') postId: string, @Body() modifyPostRequestDto: CreatePostRequestDto) {
        const parsedPostId = parseInt(postId);
        return this.postService.modify(parsedPostId, modifyPostRequestDto)
    }
}
