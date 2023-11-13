import {CategoriesEntity} from "./Categories.entity";

export interface CategoryRepository {
    findOneById(categoryId: number): Promise<CategoriesEntity | null>

    findOneByName(name: string): Promise<CategoriesEntity | null>

    save(category: CategoriesEntity): Promise<CategoriesEntity>

    removeOne(category: CategoriesEntity): Promise<CategoriesEntity>
}