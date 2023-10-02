import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import {initializeTransactionalContext} from "typeorm-transactional";
import {DataSource} from "typeorm";
import {SignUpRequestDto} from "../dto/signUp.request.dto";
import {validate} from "class-validator";

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

    describe('회원가입 양식 유효성 검사', () => {
        const signUpDto = new SignUpRequestDto();
        it.each([
            ['xptmxmlqslek123', true], // 검사 통과 아이디 값(정상)
            ['', false], // 아이디 미입력 검사
            ['XPTMXMDLQSLEK123', false],       // 대문자 검사
            ['xptmxmdlqslek!@#', false],       // 특수문자 검사
            ['tt1', false], // 길이 미달 검사
            ['xptmxmdxpmxpxmpxmpxmpxmlqslek!@#', false], // 길이 초과 검사

        ])('account 필드 유효성 검사', async (account, isValid) => {
            signUpDto.account = account;
            const errors = await validate(signUpDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        });
    });

    describe('/users/signup (POST)', () => {
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