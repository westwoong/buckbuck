import {CategoryRepository} from "./category.repository";
import {Injectable} from "@nestjs/common";
import {CategoriesEntity} from "./Categories.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class TypeormCategoryRepository implements CategoryRepository {

    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoryRepository: Repository<CategoriesEntity>,
    ) {
    }

    async findOneById(id: number): Promise<CategoriesEntity | null> {
        return await this.categoryRepository.findOne({
            where: {id: id}
        })
    }

    async findOneByName(name: string): Promise<CategoriesEntity | null> {
        return await this.categoryRepository.findOne({
            where: {name: name}
        })
    }

    async save(category: CategoriesEntity): Promise<CategoriesEntity> {
        return await this.categoryRepository.save(category);
    }
}