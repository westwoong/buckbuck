import {Body, Controller, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {SignUpRequestDto} from "./dto/signUp.request.dto";
import {SignInRequestDto} from "./dto/signIn.request.dto";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {ApiOperation} from "@nestjs/swagger";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/signup')
    @ApiOperation({summary: '유저 회원가입 API', description: '입력 받은 값으로 유저를 생성한다.'})
    @HttpCode(201)
    signUp(@Body() signUpRequestDto: SignUpRequestDto) {
        return this.userService.signUp(signUpRequestDto);
    }

    @Post('/signin')
    @HttpCode(200)
    signIn(@Body() signInRequestDto: SignInRequestDto) {
        return this.userService.signIn(signInRequestDto);
    }

    @Get('/')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getUsers() {
        return this.userService.getUsers()
    }
}
