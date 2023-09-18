import {IsNotEmpty, Length} from "class-validator";

export class CreateCategoryRequestDto {
    @IsNotEmpty()
    @Length(2, 10)
    name: string;
}