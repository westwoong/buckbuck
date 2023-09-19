import {IsNotEmpty} from "class-validator";

export class CreateCommentRequestDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    proposalCost: number;
}