export class CreateCommentResponseDto {
    content: string;
    proposalCost: number;

    constructor(createCommentResponseDto: CreateCommentResponseDto) {
        this.content = createCommentResponseDto.content;
        this.proposalCost = createCommentResponseDto.proposalCost;
    }
}