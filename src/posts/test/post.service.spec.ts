import {BadRequestException, INestApplication, ValidationPipe} from "@nestjs/common";
import {PostService} from "../post.service";
import {TypeormPostRepository} from "../typeormPost.repository";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {POST_REPOSITORY, USER_REPOSITORY} from "../../common/injectToken.constant";
import {PostEntity} from "../Post.entity";
import {TypeormUserRepository} from "../../users/typeormUser.repository";

describe('PostService', () => {
    let app: INestApplication;
    let postService: PostService;
    let userRepository: TypeormUserRepository;
    let postRepository: TypeormPostRepository;
    let userId = 1231;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        postService = moduleRef.get<PostService>(PostService);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    })

    describe('create Post', () => {
        it('사용자가 존재하지 않을 시 400 에러를 반환한다', async () => {
            const post = new PostEntity({
                title: '테스트 제목입니다.',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            })
            await expect(postService.create(userId, post)).rejects.toThrow(BadRequestException);
        })
    })
})