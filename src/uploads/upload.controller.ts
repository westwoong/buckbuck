import {
    Controller,
    Delete,
    HttpCode,
    Param,
    ParseIntPipe,
    Request,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {UploadService} from "./upload.service";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {FilesInterceptor} from "@nestjs/platform-express";
import {multerS3Config} from "./config/multerS3.config";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UploadResponseDto} from "./dto/upload.response.dto";
import {UserIdRequest} from "../common/userId.request.interface";

@ApiTags('파일 업로드 API')
@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
    }

    @Post('/')
    @ApiBearerAuth('Auth')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({summary: '파일 업로드 API', description: '게시글 이미지를 업로드한다.'})
    @ApiResponse({status: 201, description: '업로드 된 사진의 URL을 반환한다', type: UploadResponseDto})
    @HttpCode(201)
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                postImages: {
                    type: 'array',
                    format: 'binary',
                    description: '이미지 파일 업로드'
                }
            }
        }
    })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('postImages', 5, multerS3Config()))
    async upload(
        @Request() req: UserIdRequest,
        @UploadedFiles() postImages: Array<Express.Multer.File>
    ) {
        const userId = req.user.userId;
        return await this.uploadService.fileUpload(userId, postImages);
    }

    @Delete(':imageId')
    @HttpCode(204)
    @ApiBearerAuth('Auth')
    @ApiHeader({
        name: 'Authorization',
        description: '로그인 토큰을 입력하세요',
        required: true,
    })
    @ApiResponse({status: 204, description: 'No Content'})
    @UseGuards(JwtAuthGuard)
    async delete(
        @Request() req: UserIdRequest,
        @Param('imageId', ParseIntPipe) imageId: number
    ) {
        const userId = req.user.userId;
        return await this.uploadService.deleteByImageId(userId, imageId);
    }

}

