import {BadRequestException, INestApplication, ValidationPipe} from "@nestjs/common";
import {CommentService} from "../comment.service";
import {TypeormCommentRepository} from "../typeormComment.repository";
import {DataSource} from "typeorm";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from 'dotenv';
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {COMMENT_REPOSITORY, POST_REPOSITORY, USER_REPOSITORY} from "../../common/injectToken.constant";
import {CommentEntity} from "../Comment.entity";
import {TypeormUserRepository} from "../../users/typeormUser.repository";
import {TypeormPostRepository} from "../../posts/typeormPost.repository";
import {DUMMY_POST_RESOLVE} from "../../common/mockDummyResolve";

describe('CommentService', () => {
    let app: INestApplication;
    let commentService: CommentService;
    let commentRepository: TypeormCommentRepository;
    let userRepository: TypeormUserRepository;
    let postRepository: TypeormPostRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        commentService = moduleRef.get<CommentService>(CommentService);
        commentRepository = moduleRef.get<TypeormCommentRepository>(COMMENT_REPOSITORY);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    describe('create Comment', () => {
        it('userId가 존재하지 않을 시 400 에러를 반환한다', async () => {
            const comment = new CommentEntity({content: '테스트 댓글', proposalCost: 1000});
            await jest.spyOn(postRepository, 'findOneByPostId').mockResolvedValue(DUMMY_POST_RESOLVE);
            await expect(commentService.create(1231, 1231, comment)).rejects.toThrow(BadRequestException);
        })
    })


    afterAll(async () => {
        await app.close();
    });
})