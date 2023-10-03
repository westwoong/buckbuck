import {PostEntity} from "../../posts/Post.entity";
import {IsNotEmpty, IsNumber, IsString, Length, Matches} from "class-validator";

export class CreateReviewRequestDto {
    post: PostEntity;

    @IsNotEmpty()
    @IsString()
    @Length(1, 1)
    @Matches(/^[1-5]$/)
    readonly stars: number;

    @IsString()
    @Length(0, 50)
    readonly comment: string;
}