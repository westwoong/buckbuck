import {S3Client} from "@aws-sdk/client-s3";
import * as multerS3 from "multer-s3";

import {BadRequestException} from "@nestjs/common";

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    }
});

export const multerS3Config = () => {
    return {
        storage: multerS3({
            s3: s3,
            bucket: process.env.BUCKET_NAME!,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata(_: Express.Request, file: Express.Multer.File, callback: (error: any, metadata?: any) => void) {
                callback(null, {fieldName: file.filename});
            },
            key(_: Express.Request, file: Express.Multer.File, callback: (error: any, key?: string) => void) {
                callback(null, `${Date.now().toString()}-${file.originalname}`);
            }
        }),
        limits: {
            fileSize: 10 * 1024 * 1024 // 10MB
        },
        fileFilter: (_: Express.Request, file: Express.Multer.File, callback: (error: BadRequestException | null, acceptFile: boolean) => void) => {
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                callback(new BadRequestException('10MB 미만 jpg, jpeg, png, gif 파일만 업로드 가능합니다'), false)
            } else {
                callback(null, true);
            }
        }
    }
}