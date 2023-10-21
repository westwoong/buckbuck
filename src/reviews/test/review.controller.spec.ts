import {INestApplication, ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import * as request from "supertest";

jest.mock('../review.service')

describe('ReviewController', () => {
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

    describe('/reviews (POST)', () => {
        it('정상적인 요청 시 201 응답코드를 반환한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    stars: 5,
                    comment: '친절해요'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(201)
        })
    })


})