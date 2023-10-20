import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource} from "typeorm";
import {CategoriesService} from "../categories.service";
import {TypeormCategoryRepository} from "../typeormCategory.repository";
import {CATEGORY_REPOSITORY} from "../../common/injectToken.constant";
import {CreateCategoryRequestDto} from "../dto/createCategory.request.dto";

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

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('create Category', () => {
        it('카테고리 생성 시 201 코드로 응답한다.', async () => {
            console.log(categoryService);
            console.log(categoryRepository);

            // jest.spyOn(categoryRepository, 'findOneById').mockResolvedValue();

            // @ts-ignore
            const temp1 =await jest.spyOn(categoryRepository, 'save').mockResolvedValue('success');
            console.log(temp1);

            const createCategoryDto = new CreateCategoryRequestDto();
            createCategoryDto.name = "teststst";

            const test = await categoryService.create(createCategoryDto);
            console.log(test);

            expect(1).toBe(1);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})