import {IsInt, IsNotEmpty, IsString, Length, Max, Min} from "class-validator";

export class CreateCommentRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 30)
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100000)
    proposalCost: number;
}