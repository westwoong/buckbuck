import {IsInt, IsNotEmpty, IsString, Length, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 30)
    @ApiProperty({
        description: '게시글에 남길 0~30글자 사이의 댓글',
        example: '댓글입니다.',
        required: true
    })
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100000)
    @ApiProperty({
        description: '0~100,000원 사이의 의뢰 제시 금액',
        example: 50000,
        required: true
    })
    proposalCost: number;
}