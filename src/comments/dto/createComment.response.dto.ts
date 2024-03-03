import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentResponseDto {
    @ApiProperty({
        description: '댓글 작성 시 응답 값',
        example: {
            content: '내용입니다.',
            proposalCost: 15000
        },
        required: true
    })
    content: string;
    proposalCost: number;

    constructor(createCommentResponseDto: CreateCommentResponseDto) {
        this.content = createCommentResponseDto.content;
        this.proposalCost = createCommentResponseDto.proposalCost;
    }
}