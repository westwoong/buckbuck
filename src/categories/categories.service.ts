import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CategoriesEntity} from "./Categories.entity";
import {Repository} from "typeorm";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";
import {Transactional} from "typeorm-transactional";
import {CategoryRepository} from "./category.repository";
import {CATEGORY_REPOSITORY} from "../common/injectToken.constant";

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoryRepository: Repository<CategoriesEntity>,
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository2: CategoryRepository
    ) {
    }

    @Transactional()
    async create(createCategoryRequestDto: CreateCategoryRequestDto) {
        const {name} = createCategoryRequestDto;
        const isExistCategory = await this.categoryRepository.findOne({
            where: {name: name}
        })
        if (isExistCategory) throw new ConflictException('이미 존재하는 카테고리입니다.');
        const category = new CategoriesEntity({name});
        await this.categoryRepository.save(category);

        return category
    }

    @Transactional()
    async modify(categoryId: number, modifyCategoryRequestDto: CreateCategoryRequestDto) {
        const {name} = modifyCategoryRequestDto;
        const category = await this.categoryRepository2.findOneById(categoryId);
        if (!category) throw new NotFoundException('해당 카테고리는 존재하지않습니다.');
        if (category.name === name) throw new ConflictException('이미 존재하는 카테고리입니다.');

        category.name = name;

        await this.categoryRepository.save(category);
        return
    }

    @Transactional()
    async delete(categoryId: number) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId
            }
        })
        if (!category) throw new NotFoundException('해당 카테고리는 존재하지않습니다.');
        await this.categoryRepository.remove(category);
        return
    }

}
