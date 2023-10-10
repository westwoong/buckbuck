export class CreatePostResponseDto {
    title: string;
    content: string;
    cost: number;
    level: string;
    createdAt: Date;

    constructor(createPostResponseDto: CreatePostResponseDto) {
        this.title = createPostResponseDto.title;
        this.content = createPostResponseDto.content;
        this.cost = createPostResponseDto.cost;
        this.level = createPostResponseDto.level;
        this.createdAt = createPostResponseDto.createdAt;
    }
}
