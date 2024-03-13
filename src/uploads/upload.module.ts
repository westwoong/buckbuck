import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "../posts/Post.entity";
import {UploadEntity} from "./upload.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UploadEntity])]
})
export class UploadModule {
}