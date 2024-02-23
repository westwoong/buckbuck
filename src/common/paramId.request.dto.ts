import {IsNotEmpty, IsString, Matches} from "class-validator";

export class ParamIdRequestDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]+$/, { message: '숫자로 된 paramId를 입력해주세요' })
    paramId: string;
}