import {Body, Controller, HttpCode, Post} from '@nestjs/common';
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
}
