import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "../posts/Post.entity";
import {UploadEntity} from "./upload.entity";
import {UploadController} from "./upload.controller";
import {UploadService} from "./upload.service";
import {POST_REPOSITORY, UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {TypeormUploadRepository} from "./typeormUpload.repository";
import {TypeormPostRepository} from "../posts/typeormPost.repository";
import {LoggerModule} from "../config/logger.module";
import {UserEntity} from "../users/User.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, UploadEntity, UserEntity]),
        LoggerModule
    ],
    controllers: [UploadController],
    providers: [
        UploadService,
        {provide: UPLOAD_REPOSITORY, useClass: TypeormUploadRepository},
        {provide: POST_REPOSITORY, useClass: TypeormPostRepository},
    ]
})
export class UploadModule {
}