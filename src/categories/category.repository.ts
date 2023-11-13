import {CategoriesEntity} from "./Categories.entity";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";

export interface CategoryRepository {
    findOneById(categoryId: number): Promise<CategoriesEntity | null>

    findOneByName(name: string): Promise<CategoriesEntity | null>

    save(category: CreateCategoryRequestDto): Promise<CategoriesEntity>
}