import {Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('게시글 카테고리 API')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {
    }

    @Post()
    @ApiOperation({summary: '카테고리 생성 API', description: '카테고리를 생성한다.'})
    @HttpCode(201)
    create(@Body() createCategoryRequestDto: CreateCategoryRequestDto) {
        return this.categoryService.create(createCategoryRequestDto);
    }

    @Patch(':categoryId')
    @ApiOperation({summary: '카테고리 수정 API', description: '카테고리를 수정한다.'})
    @HttpCode(200)
    modify(@Param('categoryId', ParseIntPipe) categoryId: number,
           @Body() modifyCategoryRequestDto: CreateCategoryRequestDto
    ) {
        return this.categoryService.modify(categoryId, modifyCategoryRequestDto);
    }

    @Delete(':categoryId')
    @ApiOperation({summary: '카테고리 삭제 API', description: '카테고리를 삭제한다.'})
    @HttpCode(204)
    delete(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.categoryService.delete(categoryId);
    }
}
