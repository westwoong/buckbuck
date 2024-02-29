import {IsNotEmpty, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCategoryRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    @ApiProperty({
        description: '2~10글자 사이의 카테고리명',
        example: '테스트 카테고리',
        required: true
    })
    name: string;
}