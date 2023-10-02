import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches} from "class-validator";
import {IsOnlyLowerCaseAndNumber} from "./validators/account.validator";

export class SignUpRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    @IsOnlyLowerCaseAndNumber()
    account: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20, {message: '비밀번호는 최소 8자리 최대 20자리 까지 입력이 가능합니다'})
    @Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
        {message: '비밀번호는 영문 대소문자, 숫자, 공백을 제외한 특수문자만 입력이 가능합니다'}
    )
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^010\d{8}$/, {message: '- 을 제외한 핸드폰 번호 11자리를 입력해주세요 (예: 01012345678)'})
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    @Matches(/^[A-Za-z0-9\uac00-\ud7af]+$/, {
        message: '닉네임은 영문 대소문자, 숫자, 한글로만 이루어져야 합니다.'
    })
    nickName: string;

}