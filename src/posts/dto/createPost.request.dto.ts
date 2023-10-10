import {IsInt, IsNotEmpty, IsString, Length, Min} from "class-validator";

export class CreatePostRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(1,30)
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    cost: number;

    @IsNotEmpty()
    @IsString()
    level: string;
}