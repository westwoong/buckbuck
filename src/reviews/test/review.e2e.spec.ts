import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {initializeTransactionalContext} from "typeorm-transactional";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {PostFactory} from "../../common/testSetup/post/postFactory";
import * as request from "supertest";
import {ReviewFinder} from "../../common/testSetup/review/reviewFinder";
import {UserFinder} from "../../common/testSetup/user/userFinder";

describe('ReviewController (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let authService: AuthService;

    beforeAll(async () => {
        initializeTransactionalContext();
        process.env.NODE_ENV = 'local';
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
        if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'local') {
            await dataSource.dropDatabase();
        }
        await dataSource.synchronize();
    })

    describe('create Review', () => {
        it('리뷰 작성 시 httpcode 201로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            await userTokenFactory.createUserToken();
            const userToken = await userTokenFactory.createSecondUserToken();
            const userFinder = new UserFinder(dataSource);
            const performerId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, performerId);
            await postFactory.createPost();

            const review = {
                stars: 5,
                comment: '친절해요'
            }

            const response = await request(app.getHttpServer())
                .post(`/reviews/performers/${performerId}`)
                .send(review)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(201);
        })

        it('userToken이 없을 시 401 코드로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            await userTokenFactory.createUserToken();
            const userFinder = new UserFinder(dataSource);
            const performerId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, performerId);
            await postFactory.createPost();

            const review = {
                stars: 5,
                comment: '친절해요'
            }

            const response = await request(app.getHttpServer())
                .post(`/reviews/performers/${performerId}`)
                .send(review)
            expect(response.status).toBe(401);
        })

        it('리뷰가 정상적으로 저장되었는지 확인한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            await userTokenFactory.createUserToken();
            const userToken = await userTokenFactory.createSecondUserToken();
            const userFinder = new UserFinder(dataSource);
            const performerId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, performerId);
            await postFactory.createPost();

            const review = {
                stars: 5,
                comment: '친절해요'
            }

            await request(app.getHttpServer())
                .post(`/reviews/performers/${performerId}`)
                .send(review)
                .set('Authorization', `Bearer ${userToken}`);

            const reviewFinder = new ReviewFinder(dataSource);
            const savedReview = await reviewFinder.getReview();

            expect(review.stars).toBe(savedReview!.stars);
            expect(review.comment).toBe(savedReview!.comment);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})