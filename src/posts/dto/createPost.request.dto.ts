import {IsInt, IsNotEmpty, IsString, Length, Max, Min} from "class-validator";

export class CreatePostRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(1,20)
    title: string;

    @IsNotEmpty()
    @IsString()
    @Length(1,30)
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100000)
    cost: number;

    @IsNotEmpty()
    @IsString()
    @Length(1,10)
    level: string;
}
