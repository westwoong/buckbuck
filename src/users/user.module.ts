import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./User.entity";
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {AuthModule} from "../auth/auth.module";
import {USER_REPOSITORY} from "../common/injectToken.constant";
import {TypeormUserRepository} from "./typeormUser.repository";
import {LoggerModule} from "../config/logger.module";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, LoggerModule],
    providers: [
        UserService,
        {provide: USER_REPOSITORY, useClass: TypeormUserRepository},
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {
}
