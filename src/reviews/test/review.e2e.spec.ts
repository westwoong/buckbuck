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
import {validate} from "class-validator";
import {CreateReviewRequestDto} from "../dto/createReview.request.dto";

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

    describe('리뷰 작성 stars 유효성 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            [1, true],
            [2, true],
            [3, true],
            [4, true],
            [5, true],
            [6, false],
        ])('title 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (stars, isValid) => {
            createReviewRequestDto.stars = stars;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            ['테스트 리뷰 작성입니다.', true],
            ['', false],
            ['이것은 테스트 리뷰입니다 20글자가 넘으면 안됩니다', false],
        ])('title 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (comment, isValid) => {
            createReviewRequestDto.comment = comment;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
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
                    stars: 5,
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