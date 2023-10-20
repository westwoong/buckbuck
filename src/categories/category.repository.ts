import {CategoriesEntity} from "./Categories.entity";

export interface CategoryRepository {
    findOneById(id: number): Promise<CategoriesEntity | null>
}