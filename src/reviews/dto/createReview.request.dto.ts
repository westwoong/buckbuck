import {IsInt, IsNotEmpty, IsString, Length, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateReviewRequestDto {
    postId: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: '최소 별점은 1점입니다.' })
    @Max(5, { message: '최대 별점은 5점입니다.' })
    @ApiProperty({
        description: '1~5 사이의 별점',
        example: 5,
        required: true
    })
    stars: number;

    @IsString()
    @IsNotEmpty()
    @Length(0, 20)
    @ApiProperty({
        description: '0~20글자 사이의 리뷰 댓글',
        example: '리뷰입니다.',
        required: true
    })
    comment: string;
}