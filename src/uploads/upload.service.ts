import {Injectable, Inject, ServiceUnavailableException, NotFoundException} from "@nestjs/common";
import {UploadRepository} from "./upload.repository";
import {UploadEntity} from "./upload.entity";
import {UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {Transactional} from "typeorm-transactional";
import {UploadResponseDto} from "./dto/upload.response.dto";
import {MulterS3FileLocation} from "./dto/upload.location.interface";
import {Logger} from "winston";
import {S3Client, DeleteObjectCommand} from "@aws-sdk/client-s3";

@Injectable()
export class UploadService {
    constructor(
        @Inject(UPLOAD_REPOSITORY)
        private readonly uploadRepository: UploadRepository,
        private readonly logger: Logger,
    ) {
    }

    @Transactional()
    async fileUpload(files: Array<Express.Multer.File>) {
        try {
            const uploadFiles: UploadEntity[] = [];

            for (const file of files) {
                let url = (file as MulterS3FileLocation).key;
                let sequence = uploadFiles.length + 1;
                const uploadEntity = new UploadEntity({url, sequence});
                uploadFiles.push(uploadEntity)
            }
            await this.uploadRepository.uploadFile(uploadFiles);

            return new UploadResponseDto(uploadFiles);
        } catch (error) {
            this.logger.debug(`업로드 실패 기록 - 시간: ${Date.now()}, 오류: ${error}`);
            throw new ServiceUnavailableException(`업로드에 실패하였습니다: ${error}`)
        }
    }

    @Transactional()
    async deleteByImageId(imageId: number) {
        const s3 = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            }
        });

        const image = await this.uploadRepository.findOneById(imageId);
        if (!image) throw new NotFoundException(`${imageId} 해당 이미지는 존재하지않습니다`);
        console.log(image.url);

        const deleteImage = {
            Bucket: process.env.BUCKET_NAME!,
            Key: image.url
        }
        const deleteCommand = new DeleteObjectCommand(deleteImage);
        const deleteBucketImage = await s3.send(deleteCommand);

        if (deleteBucketImage) {
            await this.uploadRepository.remove(image);
        }
    }
}
