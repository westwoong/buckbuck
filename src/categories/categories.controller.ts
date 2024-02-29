import {Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateCategoryResponseDto} from "./dto/createCategory.response.dto";

@ApiTags('게시글 카테고리 API')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {
    }

    @Post()
    @ApiOperation({summary: '카테고리 생성 API', description: '카테고리를 생성한다.'})
    @ApiResponse({status: 201, description: '생성한 카테고리명을 반환한다', type: CreateCategoryResponseDto})
    @HttpCode(201)
    create(@Body() createCategoryRequestDto: CreateCategoryRequestDto) {
        return this.categoryService.create(createCategoryRequestDto);
    }

    @Patch(':categoryId')
    @ApiOperation({summary: '카테고리 수정 API', description: '카테고리를 수정한다.'})
    @ApiResponse({status: 200, description: 'No Content'})
    @HttpCode(200)
    modify(@Param('categoryId', ParseIntPipe) categoryId: number,
           @Body() modifyCategoryRequestDto: CreateCategoryRequestDto
    ) {
        return this.categoryService.modify(categoryId, modifyCategoryRequestDto);
    }

    @Delete(':categoryId')
    @ApiOperation({summary: '카테고리 삭제 API', description: '카테고리를 삭제한다.'})
    @ApiResponse({status: 204, description: 'No Content'})
    @HttpCode(204)
    delete(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.categoryService.delete(categoryId);
    }
}
