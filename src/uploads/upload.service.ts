import {Injectable, Inject, ServiceUnavailableException} from "@nestjs/common";
import {UploadRepository} from "./upload.repository";
import {UploadEntity} from "./upload.entity";
import {UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {Transactional} from "typeorm-transactional";
import {UploadResponseDto} from "./dto/upload.response.dto";
import {MulterS3FileLocation} from "./dto/upload.location.interface";

@Injectable()
export class UploadService {
    constructor(
        @Inject(UPLOAD_REPOSITORY)
        private readonly uploadRepository: UploadRepository,
    ) {
    }

    @Transactional()
    async fileUpload(files: Array<Express.Multer.File>) {
        try {
            const uploadFiles: UploadEntity[] = [];

            for (const file of files) {
                let url = (file as MulterS3FileLocation).location;
                let sequence = uploadFiles.length + 1;
                const uploadEntity = new UploadEntity({url, sequence});
                uploadFiles.push(uploadEntity)
            }
            await this.uploadRepository.uploadFile(uploadFiles);

            return new UploadResponseDto(uploadFiles);
        } catch (error) {
            throw new ServiceUnavailableException(`업로드에 실패하였습니다: ${error}`)
        }
    }
}
