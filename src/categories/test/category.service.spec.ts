import {ConflictException, INestApplication, NotFoundException, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {CategoriesService} from "../categories.service";
import {TypeormCategoryRepository} from "../typeormCategory.repository";
import {CATEGORY_REPOSITORY} from "../../common/injectToken.constant";
import {CategoriesEntity} from "../Categories.entity";

describe('CategoryService ', () => {
    let app: INestApplication;
    let categoryService: CategoriesService;
    let categoryRepository: TypeormCategoryRepository;
    let categoryId = 1231;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        categoryService = moduleRef.get<CategoriesService>(CategoriesService);
        categoryRepository = moduleRef.get<TypeormCategoryRepository>(CATEGORY_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    describe('create Category', () => {
        it('카테고리 생성 중 동일한 카테고리명이 있을 시 409에러를 반환한다.', async () => {
            const category = new CategoriesEntity({name: '해줘'});
            await jest.spyOn(categoryRepository, 'findOneByName').mockResolvedValue(category)
            await expect(categoryService.create(category)).rejects.toThrow(ConflictException);
        })
    })

    describe('modify Category', () => {
        it('기존 카테고리가 없을 때 수정을 할 시 404에러를 반환한다.', async () => {
            const category = new CategoriesEntity({name: '수정해줘'});
            await expect(categoryService.modify(categoryId, category)).rejects.toThrow(NotFoundException);
        })

        it('수정하려는 카테고리 명이 이미 존재할 시 409 에러를 반환한다.', async () => {
            const category = new CategoriesEntity({name: '수정해줘'});
            await jest.spyOn(categoryRepository, 'findOneById').mockResolvedValue(category);
            await jest.spyOn(categoryRepository, 'findOneByName').mockResolvedValue(category);
            await expect(categoryService.modify(categoryId, category)).rejects.toThrow(ConflictException);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})