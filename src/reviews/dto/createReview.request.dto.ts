import {PostEntity} from "../../posts/Post.entity";
import {IsInt, IsNotEmpty, IsString, Length, Max, Min} from "class-validator";

export class CreateReviewRequestDto {
    post: PostEntity;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: '최소 별점은 1점입니다.' })
    @Max(5, { message: '최대 별점은 5점입니다.' })
    stars: number;

    @IsString()
    @IsNotEmpty()
    @Length(0, 20)
    comment: string;
}