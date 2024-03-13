import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "../posts/Post.entity";
import {UploadEntity} from "./upload.entity";
import {UploadController} from "./upload.controller";
import {UploadService} from "./upload.service";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UploadEntity])],
    controllers: [UploadController],
    providers: [
        UploadService
    ]
})
export class UploadModule {
}