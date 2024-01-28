import {INestApplication, ValidationPipe} from "@nestjs/common";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from "supertest";

jest.mock('../user.service');

describe('UserController', () => {
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

    describe('/users/signup (POST)', () => {
        it('정상적인 요청시 201 응답코드를 반환한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                .expect(201)
        })

        it('account 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    password: "testpassword123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                .expect(400);
        })

        it('password 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    account: "xptmxmlqslek123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                .expect(400)
        })

        it('name 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                .expect(400)
        })

        it('email 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "홍길동",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                .expect(400)
        })

        it('phoneNumber 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    nickName: "빨리점11"
                })
                .expect(400)
        })

        it('nickName 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signup')
                .send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                })
                .expect(400)
        })

    })

    describe('/users/signin (POST)', () => {
        it('아이디와 비밀번호를 전부 입력 시 200 응답코드를 반환한다', async () => {
            return request(app.getHttpServer())
                .post('/users/signin')
                .send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                })
                .expect(200)
        })

        it('account 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signin')
                .send({
                    password: "testpassword123",
                })
                .expect(400)
        })

        it('password 의 값이 비어있을 시 400으로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/users/signin')
                .send({
                    account: "xptmxmlqslek123"
                })
                .expect(400)
        })
    })

    afterAll(async () => {
        await app.close();
    })
})