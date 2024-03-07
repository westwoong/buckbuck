import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import {initializeTransactionalContext} from "typeorm-transactional";
import {DataSource} from "typeorm";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import * as path from 'path';


describe('UserController (E2E)', () => {
    let app: INestApplication;
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
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(201);
            })

            it('입력한 아이디로 이미 가입되어 있을 시 409으로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource);
                await userTokenFactory.createUser();
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "길동이",
                    email: "test123@example.com",
                    phoneNumber: "01012345678",
                    nickName: "빨리점1"
                })
                expect(response.status).toBe(409);
            })

            it('입력한 이메일로 이미 가입되어 있을 시 409으로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource);
                await userTokenFactory.createUser();
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek111",
                    password: "testpassword123",
                    name: "길동이",
                    email: "test11r@example.com",
                    phoneNumber: "01012345678",
                    nickName: "빨리점1"
                })
                expect(response.status).toBe(409);
            })

            it('입력한 휴대폰번호로 이미 가입되어 있을 시 409으로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource);
                await userTokenFactory.createUser();
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek111",
                    password: "testpassword123",
                    name: "길동이",
                    email: "test1234@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점1"
                })
                expect(response.status).toBe(409);
            })

            it('입력한 닉네임이 이미 존재할 시 409으로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource);
                await userTokenFactory.createUser();
                const response = await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek111",
                    password: "testpassword123",
                    name: "길동이",
                    email: "test1234@example.com",
                    phoneNumber: "01012345678",
                    nickName: "빨리점11"
                })
                expect(response.status).toBe(409);
            })
        })

        it('회원정보가 정상적으로 저장되었는지 확인한다', async () => {
            const signUp = {
                account: "xptmxmlqslek123",
                password: "testpassword123",
                name: "홍길동",
                email: "test11r@example.com",
                phoneNumber: "01052828282",
                nickName: "빨리점11"
            }
            await request(app.getHttpServer()).post('/users/signup').send(signUp)

            const userFinder = new UserFinder(dataSource);
            const user = await userFinder.userInfo()

            expect(signUp.account).toBe(user.account);
            expect(signUp.name).toBe(user.name);
            expect(signUp.email).toBe(user.email);
            expect(signUp.phoneNumber).toBe(user.phoneNumber);
            expect(signUp.nickName).toBe(user.nickName);
            expect(user.password).toBeDefined();

        })
    })


    describe('/users/signin (POST)', () => {
        describe('로그인 시 httpcode 응답 값이 정상인지 확인한다', () => {
            it('로그인에 성공하면 200으로 응답한다', async () => {
                await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                const signIn = await request(app.getHttpServer()).post('/users/signin').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                })
                expect(signIn.status).toBe(200);
            })

            it('로그인 실패 시 400으로 응답한다', async () => {
                await request(app.getHttpServer()).post('/users/signup').send({
                    account: "xptmxmlqslek123",
                    password: "testpassword123",
                    name: "홍길동",
                    email: "test11r@example.com",
                    phoneNumber: "01052828282",
                    nickName: "빨리점11"
                })
                const signIn = await request(app.getHttpServer()).post('/users/signin').send({
                    account: "wkfahtehlsid123",
                    password: "wkfahtehlspassword123",
                })
                expect(signIn.status).toBe(400);
            })
        })

        it('로그인 성공시 body값이 존재해야한다', async () => {
            await request(app.getHttpServer()).post('/users/signup').send({
                account: "xptmxmlqslek123",
                password: "testpassword123",
                name: "홍길동",
                email: "test11r@example.com",
                phoneNumber: "01052828282",
                nickName: "빨리점11"
            })
            const signIn = await request(app.getHttpServer()).post('/users/signin').send({
                account: "xptmxmlqslek123",
                password: "testpassword123",
            })

            expect(signIn.body).toBeDefined();
        })
    })

    afterAll(async () => {
        await app.close();
    })
})