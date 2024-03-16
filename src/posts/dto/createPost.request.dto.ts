import {IsArray, IsInt, IsNotEmpty, IsString, Length, Max, Min, Matches, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    @ApiProperty({
        description: '1~20글자 사이의 게시글 제목',
        example: '제목입니다.',
        required: true
    })
    title: string;

    @IsArray()
    @IsString()
    @IsOptional()
    @Matches(
        /^https:\/\/buckbuck-uploaded\.s3\.ap-northeast-2\.amazonaws\.com\/.*$/,
        {
            each: true, // URL 검증
            message: 'https://buckbuck-uploaded.s3.ap-northeast-2.amazonaws.com 내에 있는 이미지만 허용됩니다.'
        })
    @ApiProperty({
        description: '업로드한 이미지 S3 주소',
        example: [
            "https://buckbuck-uploaded.s3.ap-northeast-2.amazonaws.com/1710605624135-images.jpeg",
            "https://buckbuck-uploaded.s3.ap-northeast-2.amazonaws.com/1710605624136-184293.jpg"
        ]
    })
    images?: Array<string>

    @IsNotEmpty()
    @IsString()
    @Length(1, 300)
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
    @Length(1, 10)
    @ApiProperty({
        description: '1~10글자 사이의뢰 난이도 레벨',
        example: '어려울거같아요',
        required: true
    })
    level: string;
}
