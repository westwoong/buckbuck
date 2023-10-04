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
        it('카테고리 생성 시 name의 필드값에 카테고리명이 담긴다.', async () => {
            const fixtureCategory = {name: '테스트 카테고리'};
            const response = await request(app.getHttpServer())
                .post(`/categories`)
                .send(fixtureCategory)

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(fixtureCategory.name);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})