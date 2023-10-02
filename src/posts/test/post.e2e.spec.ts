import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import * as request from 'supertest';
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from '../../common/testSetup/userTokenFactory'

describe('PostController (E2E)', () => {
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

    describe('create Post', () => {
        it('게시글을 작성 시 body값이 fixture 값과 동일해야한다.', async () => {
            // Given = 테스트 사전 Fixture
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();

            const fixturePost = {
                title: '테스트 제목입니다.',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            }
            // When =
            const response = await request(app.getHttpServer())
                .post('/posts')
                .send(fixturePost).set('Authorization', `Bearer ${userToken}`);
            // then
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(fixturePost.title);
            expect(response.body.content).toBe(fixturePost.content);
            expect(response.body.cost).toBe(fixturePost.cost);
            expect(response.body.level).toBe(fixturePost.level);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})
