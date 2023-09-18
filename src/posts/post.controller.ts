import {Body, Controller, Delete, HttpCode, Param, Patch, Post} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostRequestDto} from "./dto/createPost.request.dto";

@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) {
    }

    @Post()
    @HttpCode(201)
    create(@Body() createPostRequestDto: CreatePostRequestDto) {
        return this.postService.create(createPostRequestDto);

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
