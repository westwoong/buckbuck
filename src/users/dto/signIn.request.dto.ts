import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignInRequestDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '회원가입한 ID를 입력한다',
        example: 'foobar1324',
        required: true
    })
    account: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '회원가입한 ID의 비밀번호를 입력한다.',
        example: 'password!!@@##1234',
        required: true
    })
    password: string;
}