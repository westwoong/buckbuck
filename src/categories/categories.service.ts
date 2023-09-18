import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CategoriesEntity} from "./Categories.entity";
import {Repository} from "typeorm";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoryRepository: Repository<CategoriesEntity>) {
    }

    async create(createCategoryRequestDto: CreateCategoryRequestDto) {
        const {name} = createCategoryRequestDto;
        const category = new CategoriesEntity({name});
        await this.categoryRepository.save(category);

        return category;
    }
}
