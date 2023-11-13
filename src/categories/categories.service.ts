import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CategoriesEntity} from "./Categories.entity";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";
import {Transactional} from "typeorm-transactional";
import {CategoryRepository} from "./category.repository";
import {CATEGORY_REPOSITORY} from "../common/injectToken.constant";
import {CreateCategoryResponseDto} from "./dto/createCategory.response.dto";

@Injectable()
export class CategoriesService {

    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: CategoryRepository
    ) {
    }

    @Transactional()
    async create(createCategoryRequestDto: CreateCategoryRequestDto) {
        const {name} = createCategoryRequestDto;
        const isExistCategory = await this.categoryRepository.findOneByName(name);

        if (isExistCategory) throw new ConflictException('이미 존재하는 카테고리입니다.');

        const category = new CategoriesEntity({name});
        await this.categoryRepository.save(category);

        return new CreateCategoryResponseDto(category);
    }

    @Transactional()
    async modify(categoryId: number, modifyCategoryRequestDto: CreateCategoryRequestDto) {
        const {name} = modifyCategoryRequestDto;
        const category = await this.categoryRepository.findOneById(categoryId);
        if (!category) throw new NotFoundException('해당 카테고리는 존재하지않습니다.');

        const isExistCategory = await this.categoryRepository.findOneByName(name);
        if (isExistCategory) throw new ConflictException('이미 존재하는 카테고리입니다.');

        category.name = name;

        await this.categoryRepository.save(category);
        return
    }

    @Transactional()
    async delete(categoryId: number) {
        const category = await this.categoryRepository.findOneById(categoryId);
        if (!category) throw new NotFoundException('해당 카테고리는 존재하지않습니다.');
        await this.categoryRepository.removeOne(category);
        return
    }

}
