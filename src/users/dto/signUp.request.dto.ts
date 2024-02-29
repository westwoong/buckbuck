import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches} from "class-validator";
import {IsOnlyLowerCaseAndNumber} from "./validators/account.validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignUpRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    @IsOnlyLowerCaseAndNumber()
    @ApiProperty({description: '5~20자리 아이디'})
    account: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20, {message: '비밀번호는 최소 8자리 최대 20자리 까지 입력이 가능합니다'})
    @Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
        {message: '비밀번호는 영문 대소문자, 숫자, 공백을 제외한 특수문자만 입력이 가능합니다'}
    )
    @ApiProperty({description: '8~20자리 비밀번호'})
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    @Matches(/^[가-힣]+$/, {message: '이름은 한글만 입력이 가능합니다.'})
    @ApiProperty({description: '2~10자리 한글로된 이름'})
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({description: '이메일'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^010\d{8}$/, {message: '- 을 제외한 핸드폰 번호 11자리를 입력해주세요 (예: 01012345678)'})
    @ApiProperty({description: '- 을 제외한 핸드폰 번호 11자리'})
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    @Matches(/^[A-Za-z0-9\uac00-\ud7af]+$/, {
        message: '닉네임은 영문 대소문자, 숫자, 한글로만 이루어져야 합니다.'
    })
    @ApiProperty({description: '영문, 숫자, 한글로 이루어진 2~10자리 닉네임'})
    nickName: string;

}