export class CreatePostResponseDto {
    title: string;
    content: string;
    createdAt: Date;

    constructor(createPostResponseDto: CreatePostResponseDto) {
        this.title = createPostResponseDto.title;
        this.content = createPostResponseDto.content;
        this.createdAt = createPostResponseDto.createdAt;
    }
}
