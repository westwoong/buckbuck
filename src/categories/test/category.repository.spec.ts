import {INestApplication, ValidationPipe} from "@nestjs/common";
import {TypeormCategoryRepository} from "../typeormCategory.repository";
import {DataSource} from "typeorm";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {CATEGORY_REPOSITORY} from "../../common/injectToken.constant";
import {CategoriesEntity} from "../Categories.entity";

describe('CategoryRepository', () => {
    let app: INestApplication;
    let categoryRepository: TypeormCategoryRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
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
        it('카테고리의 정보를 가져온다', async () => {
            const category = new CategoriesEntity({name: '테스트 카테고리'})
            await categoryRepository.save(category);

            const foundCategory = await categoryRepository.findOneById(category.id);
            expect(foundCategory?.id).toBeDefined();
            expect(foundCategory?.name).toBeDefined();
        })
    })

    describe('findOneByName()', () => {

    })

    describe('save()', () => {

    })
})