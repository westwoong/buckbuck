import {ConflictException, INestApplication, NotFoundException, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import {CategoriesService} from "../categories.service";
import {TypeormCategoryRepository} from "../typeormCategory.repository";
import {CATEGORY_REPOSITORY} from "../../common/injectToken.constant";
import {CategoriesEntity} from "../Categories.entity";
import {DUMMY_CATEGORY_RESOLVE} from "../../common/mockDummyResolve";

describe('CategoryService ', () => {
    let app: INestApplication;
    let categoryService: CategoriesService;
    let categoryRepository: TypeormCategoryRepository;
    let categoryId = 1231;

    beforeAll(async () => {
        initializeTransactionalContext();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        categoryService = moduleRef.get<CategoriesService>(CategoriesService);
        categoryRepository = moduleRef.get<TypeormCategoryRepository>(CATEGORY_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    });

    describe('create Category', () => {
        it('카테고리 생성 중 동일한 카테고리명이 있을 시 409에러를 반환한다.', async () => {
            const category = new CategoriesEntity({name: '해줘'});
            await jest.spyOn(categoryRepository, 'findOneByName').mockResolvedValue(category)
            await jest.spyOn(categoryRepository, 'save').mockResolvedValue(category)
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

    describe('delete Category', () => {
        it('삭제 하려는 카테고리가 존재하지 않을 시 404 에러를 반환한다.', async () => {
            await jest.spyOn(categoryRepository, 'findOneById').mockResolvedValue(null)
            await jest.spyOn(categoryRepository, 'removeOne').mockResolvedValue(DUMMY_CATEGORY_RESOLVE)
            await expect(categoryService.delete(categoryId)).rejects.toThrow(NotFoundException);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})