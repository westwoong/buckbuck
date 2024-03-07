import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import * as request from "supertest";

describe('CategoryController (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let authService: AuthService;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        authService = moduleRef.get<AuthService>(AuthService);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('create Category', () => {
        describe('카테고리 생성 시 httpcode 응답 값이 정상인지 확인한다.', () => {
            it('카테고리 생성 시 201 코드로 응답한다.', async () => {
                const category = {name: '테스트 카테고리'};

                const response = await request(app.getHttpServer())
                    .post(`/categories`)
                    .send(category)

                expect(response.status).toBe(201);
            })
        })
    })

    afterAll(async () => {
        await app.close();
    });
})