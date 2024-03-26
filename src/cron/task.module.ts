import {Module} from '@nestjs/common';
import {TaskService} from "./task.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UploadEntity} from "../uploads/upload.entity";
import {UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {TypeormUploadRepository} from "../uploads/typeormUpload.repository";
import {LoggerModule} from "../config/logger.module";

@Module({
    imports: [TypeOrmModule.forFeature([UploadEntity]), LoggerModule],
    providers: [
        TaskService,
        {provide: UPLOAD_REPOSITORY, useClass: TypeormUploadRepository}
    ]
})
export class TaskModule {
}
