import {ApiProperty} from "@nestjs/swagger";

export class CreatePostResponseDto {

    @ApiProperty({
        description: '게시글 생성 응답값',
        example: {
            title: '제목',
            content: '내용',
            cost: 15000,
            level: '초급',
            createdAt: '2222-02-22T22:22:22.000Z'
        },
        required: true
    })
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
