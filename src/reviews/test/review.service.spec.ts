import {INestApplication, NotFoundException, ValidationPipe} from "@nestjs/common";
import {ReviewService} from "../review.service";
import {TypeormReviewRepository} from "../typeormReview.repository";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {REVIEW_REPOSITORY, USER_REPOSITORY} from "../../common/injectToken.constant";
import {DUMMY_REVIEW_RESOLVE, DUMMY_USER_RESOLVE} from "../../common/mockDummyResolve";
import {ReviewEntity} from "../Review.entity";
import {TypeormUserRepository} from "../../users/typeormUser.repository";
import path from "path";

describe('ReviewService', () => {
    let app: INestApplication;
    let reviewService: ReviewService;
    let reviewRepository: TypeormReviewRepository;
    let userRepository: TypeormUserRepository;
    let requesterId = 1231;
    let performerId = 1321;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config({
            path: path.resolve(
                process.env.NODE_ENV === 'product' ? '.env.product' :
                    process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
            )
        });
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        reviewService = moduleRef.get<ReviewService>(ReviewService);
        reviewRepository = moduleRef.get<TypeormReviewRepository>(REVIEW_REPOSITORY);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    })

    describe('create Review', () => {
        it('리뷰를 작성할 게시글이 존재하지 않을경우 404 에러를 반환한다', async () => {
            const review = new ReviewEntity({
                postId: 1,
                stars: 5,
                comment: '친절해요',
                requesterId,
                performerId
            })
            await jest.spyOn(reviewRepository, 'findOneByRequesterIdAndPost').mockResolvedValue(DUMMY_REVIEW_RESOLVE);
            await jest.spyOn(userRepository, 'findOneById').mockResolvedValue(DUMMY_USER_RESOLVE);
            await expect(reviewService.create(requesterId, performerId, review)).rejects.toThrow(NotFoundException);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})