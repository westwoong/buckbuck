import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import * as request from 'supertest';
import {DataSource} from "typeorm";

describe('PostController (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let userToken: string;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
        await request(app.getHttpServer()).post('/users/signup').send({
            account: "xptmxmlqslek123",
            password: "testpassword123",
            name: "김돌쇠",
            email: "test11r@example.com",
            phoneNumber: "01052828282",
            nickName: "빨리점11"
        })
        let userLogin = await request(app.getHttpServer()).post('/users/signin').send({
            account: "xptmxmlqslek123",
            password: "testpassword123",
        })
        userToken = userLogin.text;
    })

    describe('create', () => {
        it('게시글을 작성하면 201로 응답한다.', async () => {
            const response = await request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }).set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(201);
        })

        it('게시글 작성 중 하나라도 넣지않으면 400 코드를 반환한다.', async () => {
            await request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400);

            await request(app.getHttpServer())
                .post('/posts')
                .send({
                    content: '테스트 내용입니다.',
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400);

            await request(app.getHttpServer())
                .post('/posts')
                .send({
                    cost: 10500,
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400);

            await request(app.getHttpServer())
                .post('/posts')
                .send({
                    level: '고수'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('로그인을 안했을 시 401 코드를 반환한다', async () => {
            await request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }).expect(401);
        })

    })

    afterAll(async () => {
        await app.close();
    });
})
