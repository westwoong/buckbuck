import {Controller, HttpCode, Post, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {UploadService} from "./upload.service";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
    }

    @Post('/')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
        return this.uploadService.fileUpload(files);
    }
}

