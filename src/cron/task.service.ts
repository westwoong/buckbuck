import {Inject, Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {UploadRepository} from "../uploads/upload.repository";
import {DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Logger} from "winston";

@Injectable()
export class TaskService {
    private readonly s3: S3Client;

    constructor(
        @Inject(UPLOAD_REPOSITORY)
        private readonly uploadRepository: UploadRepository,
        private readonly logger: Logger
    ) {
        this.s3 = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
        });
    }

    @Cron(CronExpression.EVERY_DAY_AT_3AM, {name: 'S3ImageRemove', timeZone: 'Asia/Seoul'})
    async removeUnusedS3Image() {
        try {
            if (process.env.NODE_ENV === 'production') {
                const postIdNullImages = await this.uploadRepository.findByNullPostId();

                const imageDelete = await Promise.all(postIdNullImages.map(async (image) => {
                    const deleteImage = {
                        Bucket: process.env.BUCKET_NAME!,
                        Key: image.url,
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteImage);
                    const deleteBucketImage = await this.s3.send(deleteCommand);

                    if (deleteBucketImage) {
                        await this.uploadRepository.remove(image);
                    }
                }));

                if (imageDelete) {
                    this.logger.info(`${postIdNullImages.length} 개의 이미지가 삭제되었습니다.`);
                }
            }
        } catch (error) {
            this.logger.debug(`S3 미사용 이미지 삭제 실패`, error);
        }
    }
}
