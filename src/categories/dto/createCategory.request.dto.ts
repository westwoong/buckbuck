import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateCategoryRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    name: string;
}