import {Body, Controller, Delete, HttpCode, Param, Patch, Post} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";

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
    modify(@Param('categoryId') categoryId: string,
           @Body() modifyCategoryRequestDto: CreateCategoryRequestDto
    ) {
        const parsedCategoryId = parseInt(categoryId);
        return this.categoryService.modify(parsedCategoryId, modifyCategoryRequestDto);
    }

    @Delete(':categoryId')
    @HttpCode(204)
    delete(@Param('categoryId') categoryId: string) {
        const parsedCategoryId = parseInt(categoryId);
        return this.categoryService.delete(parsedCategoryId);
    }
}
