import {IsInt, IsNotEmpty, IsString, Length, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(1,20)
    @ApiProperty({
        description: '1~20글자 사이의 게시글 제목',
        example: '제목입니다.',
        required: true
    })
    title: string;

    @IsNotEmpty()
    @IsString()
    @Length(1,300)
    @ApiProperty({
        description: '1~300글자 사이의 게시글 내용',
        example: '본문 내용입니다.',
        required: true
    })
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100000)
    @ApiProperty({
        description: '0~100,000원 사이의 의뢰금',
        example: 15000,
        required: true
    })
    cost: number;

    @IsNotEmpty()
    @IsString()
    @Length(1,10)
    @ApiProperty({
        description: '1~10글자 사이의뢰 난이도 레벨',
        example: '어려울거같아요',
        required: true
    })
    level: string;
}
