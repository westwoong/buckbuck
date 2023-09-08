import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length} from "class-validator";
import {IsOnlyLowerCaseAndNumber} from "./validators/account.validator";

export class SignUpRequestDto {
    @IsNotEmpty()
    @IsString()
    @Length(5, 10)
    @IsOnlyLowerCaseAndNumber()
    readonly account: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('KR', {message: '잘못된 형식의 번호입니다.'})
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    readonly nickName: string;

}