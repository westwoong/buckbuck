import {ConflictException, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource} from "typeorm";
import {CategoriesService} from "../categories.service";
import {TypeormCategoryRepository} from "../typeormCategory.repository";
import {CATEGORY_REPOSITORY} from "../../common/injectToken.constant";
import {CategoriesEntity} from "../Categories.entity";

describe('CategoryService ', () => {
    let app: INestApplication;
    let categoryService: CategoriesService;
    let categoryRepository: TypeormCategoryRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        categoryService = moduleRef.get<CategoriesService>(CategoriesService);
        categoryRepository = moduleRef.get<TypeormCategoryRepository>(CATEGORY_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    describe('create Category', () => {
        it('카테고리명 생성 중 동일한 카테고리명이 있을 시 409에러를 반환한다.', async () => {
            const category = new CategoriesEntity({name: '해줘'});
            await jest.spyOn(categoryRepository, 'findOneByName').mockResolvedValue(category)
            await expect(categoryService.create(category)).rejects.toThrow(ConflictException);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})