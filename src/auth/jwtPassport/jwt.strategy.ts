import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {UserService} from "../../users/user.service";
import * as process from "process";
require('dotenv').config()



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOneById(payload.userId);

        if (!user) {
            throw new UnauthorizedException(
                '입력한 토큰에 해당하는 사용자는 존재하지 않습니다.',
                'NOT_EXISTING_USER_IN_TOKEN',
            );
        }

        return user;
    }
}