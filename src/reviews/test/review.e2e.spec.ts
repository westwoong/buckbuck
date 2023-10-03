import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as dotenv from 'dotenv';
import {initializeTransactionalContext} from "typeorm-transactional";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from "../../common/testSetup/userTokenFactory";
import {PostFactory} from "../../common/testSetup/postFactory";
import * as request from "supertest";

describe('ReviewController (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let authService: AuthService;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        authService = moduleRef.get<AuthService>(AuthService);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    })

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('create Review', () => {
        it('리뷰 작성 시 httpcode 201로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            await userTokenFactory.createUserToken();
            const userToken = await userTokenFactory.createSecondUserToken();
            const performerId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, performerId);
            await postFactory.createPost();

            const response = await request(app.getHttpServer())
                .post(`/reviews/performers/${performerId}`)
                .send({
                    stars: '5',
                    comment: '친절해요'
                })
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(201);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})