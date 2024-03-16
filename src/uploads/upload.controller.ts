import {Controller, HttpCode, Post, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {UploadService} from "./upload.service";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {FilesInterceptor} from "@nestjs/platform-express";
import {multerS3Config} from "./config/multerS3.config";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
    }

    @Post('/')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('postImages', 5, multerS3Config()))
    async test(@UploadedFiles() postImages: Array<Express.Multer.File>) {
        return await this.uploadService.fileUpload(postImages);
    }

}

