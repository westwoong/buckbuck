import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./User.entity";
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {AuthModule} from "../auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {
}
