import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
require('dotenv').config()

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {expiresIn: '30d'}
        })
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {
}