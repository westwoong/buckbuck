import {CategoriesEntity} from "./Categories.entity";

export interface CategoryRepository {
    findOneById(id: number): Promise<CategoriesEntity | null>

    findOneByName(name: string): Promise<CategoriesEntity | null>

    save(category: CategoriesEntity): Promise<CategoriesEntity>
}