import {INestApplication, ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from "supertest";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";

jest.mock('../post.service');

describe('PostController', () => {
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
    describe('/posts (POST)', () => {
        it('httpcode 201로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(201)
        })

        it('title 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();

            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('content 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();

            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    cost: 10500,
                    level: '고수'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('level 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();

            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('userToken 이 없을 시 401 코드로 응답한다', async () => {
            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500
                })
                .expect(401);
        })
    })

    describe('/posts/:postId (PATCH)', () => {
        it('httpcode 200으로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            return request(app.getHttpServer())
                .patch('/posts/1')
                .send({
                    title: '수정 테스트 입니다..',
                    content: '내용도 수정해볼게요',
                    cost: 50000,
                    level: '초급'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(200)
        })
    })
    describe('/posts/:postId (DELETE)', () => {
        it('httpcode 204로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            return request(app.getHttpServer())
                .delete('/posts/1')
                .send()
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204)
        })
    })
})