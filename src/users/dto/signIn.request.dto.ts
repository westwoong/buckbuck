import {IsNotEmpty, IsString} from "class-validator";

export class SignInRequestDto {

    @IsNotEmpty()
    @IsString()
    account: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}