import {Injectable, ServiceUnavailableException} from "@nestjs/common";
import {S3Client, PutObjectCommand, PutObjectCommandInput} from "@aws-sdk/client-s3";

@Injectable()
export class MulterConfig {
    private readonly s3: S3Client;

    constructor() {
        this.s3 = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.ACCESS_KEY!,
                secretAccessKey: process.env.SECRET_ACCESS_KEY!,
            },
        });
    }

    async uploadToS3(file: Express.Multer.File): Promise<{ url: string }> {
        const uploadParams: PutObjectCommandInput = {
            Bucket: process.env.BUCKET_NAME!,
            Key: `${Date.now().toString()}-${file.originalname}`,
            ContentType: file.mimetype,
            Body: file.buffer
        };

        try {
            const command = new PutObjectCommand(uploadParams);
            await this.s3.send(command);

            const url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`;
            return {url};
        } catch (error) {
            throw new ServiceUnavailableException('파일 업로드에 실패했습니다.');
        }
    }
}
