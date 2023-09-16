import {Body, Controller, HttpCode, Post} from '@nestjs/common';
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
}
