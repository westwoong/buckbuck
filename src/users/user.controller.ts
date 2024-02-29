import {Body, Controller, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {SignUpRequestDto} from "./dto/signUp.request.dto";
import {SignInRequestDto} from "./dto/signIn.request.dto";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetUsersResponseDto} from "./dto/findUsers.response.dto";

@ApiTags('사용자 API')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/signup')
    @ApiOperation({summary: '사용자 생성 API', description: '사용자를 생성한다.'})
    @ApiResponse({status: 201, description: 'Created'})
    @HttpCode(201)
    signUp(@Body() signUpRequestDto: SignUpRequestDto) {
        return this.userService.signUp(signUpRequestDto);
    }

    @Post('/signin')
    @ApiOperation({summary: '로그인 API', description: '아이디 비밀번호를 입력해 로그인한다'})
    @ApiResponse({status: 200, description: 'JWT 토큰을 발급받는다', type: 'token'})
    @HttpCode(200)
    signIn(@Body() signInRequestDto: SignInRequestDto) {
        return this.userService.signIn(signInRequestDto);
    }

    @ApiBearerAuth()
    @Get('/')
    @ApiOperation({summary: '전체 사용자 조회 API', description: '전체 사용자를 조회한다'})
    @ApiResponse({status: 200, description: '전체 사용자목록을 반환한다.', type: GetUsersResponseDto})
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    getUsers() {
        return this.userService.getUsers()
    }
}
