import {Injectable, Inject, ServiceUnavailableException, NotFoundException, ForbiddenException} from "@nestjs/common";
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
    async fileUpload(userId: number, files: Array<Express.Multer.File>) {
        try {
            const uploadFiles: UploadEntity[] = [];
            const returnImageLocations: string[] = [];

            for (const file of files) {
                let url = (file as MulterS3FileLocation).key;
                let sequence = uploadFiles.length + 1;
                const uploadEntity = new UploadEntity({url, sequence, userId});
                uploadFiles.push(uploadEntity)

                let location = (file as MulterS3FileLocation).location;
                returnImageLocations.push(location)
            }
            await this.uploadRepository.uploadFile(uploadFiles);

            return new UploadResponseDto(returnImageLocations)
        } catch (error) {
            this.logger.debug(`업로드 실패 기록 - 시간: ${Date.now()}, 오류: ${error}`);
            throw new ServiceUnavailableException(`업로드에 실패하였습니다: ${error}`)
        }
    }

    @Transactional()
    async deleteByImageId(userId: number, imageId: number) {
        const s3 = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            }
        });
        
        const uploadFile = await this.uploadRepository.findOneById(imageId);
        if (uploadFile?.userId !== userId) throw new ForbiddenException('자신이 업로드한 이미지만 삭제 가능합니다');

        const image = await this.uploadRepository.findOneById(imageId);
        if (!image) throw new NotFoundException(`${imageId} 해당 이미지는 존재하지않습니다`);

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
