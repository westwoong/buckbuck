import {Injectable, BadRequestException, Inject} from "@nestjs/common";
import {UploadRepository} from "./upload.repository";
import {MulterConfig} from "./config/multer.config";
import {UploadEntity} from "./upload.entity";
import {UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class UploadService {
    constructor(
        @Inject(UPLOAD_REPOSITORY)
        private readonly uploadRepository: UploadRepository,
        private readonly multerConfig: MulterConfig,
    ) {
    }

    @Transactional()
    async fileUpload(files: Array<Express.Multer.File>): Promise<UploadEntity[]> {
        try {
            //임시 postId
            const postId =1

            const uploadedFiles: UploadEntity[] = [];


            for (const file of files) {
                const uploadResult = await this.multerConfig.uploadToS3(file);
                const url = uploadResult.url;
                const sequence = uploadedFiles.length + 1; // 파일 업로드 순서
                const uploadEntity = new UploadEntity({url, sequence, postId});
                uploadedFiles.push(uploadEntity);
            }
            await this.uploadRepository.uploadFile(uploadedFiles);

            return uploadedFiles; // 업로드 목록 배열 리턴
        } catch (error) {
            throw new BadRequestException("파일 업로드에 실패했습니다.");
        }
    }
}
