import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {SignUpRequestDto} from "./dto/signUp.request.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/signup')
    signUp(@Body() signUpRequestDto: SignUpRequestDto) {
        console.log(signUpRequestDto);
        return this.userService.signUp(signUpRequestDto);
    }
}
