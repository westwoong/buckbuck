import {INestApplication, ValidationPipe} from "@nestjs/common";
import {TypeormCategoryRepository} from "../typeormCategory.repository";
import {DataSource} from "typeorm";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {CATEGORY_REPOSITORY} from "../../common/injectToken.constant";
import {CategoriesEntity} from "../Categories.entity";
import {CategoryFactory} from "../../common/testSetup/category/categoryFactory";
import path from "path";

describe('CategoryRepository', () => {
    let app: INestApplication;
    let categoryRepository: TypeormCategoryRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config({
            path: path.resolve(
                process.env.NODE_ENV === 'product' ? '.env.product' :
                    process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
            )
        });
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        categoryRepository = moduleRef.get<TypeormCategoryRepository>(CATEGORY_REPOSITORY);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('findOneById()', () => {
        it('id 값과 일치하는 데이터가 있으면 해당 카테고리의 정보를 가져온다', async () => {
            const categoryFactory = new CategoryFactory(dataSource);
            const category = await categoryFactory.createCategory()

            const foundCategory = await categoryRepository.findOneById(category.id);
            expect(foundCategory?.id).toBeDefined();
            expect(foundCategory?.name).toBeDefined();
        })


    })

    describe('findOneByName()', () => {
        it('일치하는 카테고리 명이 있을경우 데이터를 가져온다', async () => {
            const categoryFactory = new CategoryFactory(dataSource);
            await categoryFactory.createCategory()

            const foundCategory = await categoryRepository.findOneByName('테스트해줘');

            expect(foundCategory?.name).toBe('테스트해줘');
        })

        it('일치하는 카테고리 명이 없을경우 null 값을 반환한다', async () => {
            const foundCategory = await categoryRepository.findOneByName('우와우어');
            expect(foundCategory).toBe(null);
        })

    })

    describe('save()', () => {
        it('entity 규격에맞는 데이터를 넣을 시 카테고리명을 정상적으로 저장한다.', async () => {
            const category = new CategoriesEntity({name: '테스트해줘'})
            const savedCategory = await categoryRepository.save(category);
            expect(savedCategory.name).toBe(category.name);
        })

        it('카테고리명을 정상적으로 수정한다.', async () => {
            const categoryFactory = new CategoryFactory(dataSource);
            const category = await categoryFactory.createCategory()
            expect(category.name).toBe('테스트해줘');

            const modifyCategory = {name: '변경해줘'}

            category.name = modifyCategory.name;
            await categoryRepository.save(category);

            const modifiedCategory = await categoryRepository.findOneById(category.id);
            expect(modifiedCategory?.name).toBe('변경해줘');
        })
    })

    describe('removeOne()', () => {
        it('카테고리를 정상적으로 삭제한다', async () => {
            const categoryFactory = new CategoryFactory(dataSource);
            const category = await categoryFactory.createCategory()

            await categoryRepository.removeOne(category);

            const foundCategory = await categoryRepository.findOneById(category.id);

            expect(foundCategory).toBe(null);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})