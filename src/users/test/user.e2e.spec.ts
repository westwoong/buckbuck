import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import {initializeTransactionalContext} from "typeorm-transactional";
import {DataSource} from "typeorm";

describe('UserController (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    })

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('/users/signup (POST)', () => {
        describe('회원가입 시 httpcode 응답 값이 정상인지 확인한다.', () => {
            it('회원가입에 성공하면 201로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "김돌쇠",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(201);
            })

            it('account의 값이 비어있을 시 400으로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    password: "testpassword123",
                    name: "김돌쇠",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(400);
            })

            it('password의 값이 비어있을 시 400으로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    name: "김돌쇠",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(400);
            })

            it('name의 값이 비어있을 시 400으로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(400);
            })

            it('email의 값이 비어있을 시 400으로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "김돌쇠",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(400);
            })

            it('phoneNumber의 값이 비어있을 시 400으로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "김돌쇠",
                    email: "test11r@example.com",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(400);
            })

            it('nickName의 값이 비어있을 시 400으로 응답한다.', async () => {
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "김돌쇠",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                })
                expect(response.status).toBe(400);
            })
        })
    })


    describe('/users/signin (POST)', () => {
        it('로그인에 성공하면 200으로 응답한다', async () => {
            const signUp = await request(app.getHttpServer()).post('/users/signup').send({
                account: "xptmxmlqslek123",
                password: "testpassword123",
                name: "김돌쇠",
                email: "test11r@example.com",
                phoneNumber: "01052828282",
                nickName: "빨리점11"
            })
            const signIn = await request(app.getHttpServer()).post('/users/signin').send({
                account: "xptmxmlqslek123",
                password: "testpassword123",
            })
            expect(signUp.status).toBe(201);
            expect(signIn.body).toBeDefined();
        })
    })

    afterAll(async () => {
        await app.close();
    })
})