import {Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('게시글 카테고리 API')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {
    }

    @Post()
    @HttpCode(201)
    create(@Body() createCategoryRequestDto: CreateCategoryRequestDto) {
        return this.categoryService.create(createCategoryRequestDto);
    }

    @Patch(':categoryId')
    @HttpCode(200)
    modify(@Param('categoryId', ParseIntPipe) categoryId: number,
           @Body() modifyCategoryRequestDto: CreateCategoryRequestDto
    ) {
        return this.categoryService.modify(categoryId, modifyCategoryRequestDto);
    }

    @Delete(':categoryId')
    @HttpCode(204)
    delete(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.categoryService.delete(categoryId);
    }
}
