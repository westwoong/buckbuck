import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
import * as path from 'path';

require('dotenv').config({
    path: path.resolve(
        process.env.NODE_ENV === 'product' ? '.env.product' :
            process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
    )
});

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