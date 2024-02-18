import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource} from "typeorm";
import {CommentEntity} from "../Comment.entity";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import {PostFactory} from "../../common/testSetup/post/postFactory";
import {CommentFactory} from "../../common/testSetup/comment/commentFactory";
import {TypeormCommentRepository} from "../typeormComment.repository";
import {COMMENT_REPOSITORY} from "../../common/injectToken.constant";
import {SearchCommentResponseDto} from "../dto/searchComment.response.dto";


describe('CommentRepository (E2E)', () => {
    let app: INestApplication;
    let commentRepository: TypeormCommentRepository
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        commentRepository = moduleRef.get<TypeormCommentRepository>(COMMENT_REPOSITORY);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('save()', () => {
        it('댓글을 정상적으로 저장한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            const comment = new CommentEntity({
                content: '테스트 댓글 달아봅니다.',
                proposalCost: 15000,
                userId: userId,
                postId: post.id
            })

            const savedComment = await commentRepository.save(comment);

            expect(savedComment.content).toBe(comment.content);
            expect(savedComment.proposalCost).toBe(comment.proposalCost);
            expect(savedComment.userId).toBeDefined();
            expect(savedComment.postId).toBeDefined();
        })

        it('댓글을 정상적으로 수정한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser()
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            expect(comment.content).toBe('테스트 댓글 달아봅니다.')
            expect(comment.proposalCost).toBe(15000);

            const modifyComment = {
                content: '테스트 댓글 수정해봅니다.',
                proposalCost: 50500
            }
            comment.content = modifyComment.content;
            comment.proposalCost = modifyComment.proposalCost;

            const modifiedComment = await commentRepository.save(comment);

            expect(modifiedComment.content).toBe(modifyComment.content)
        })
    })

    describe('findCommentWithUser()', () => {
        it('댓글과 사용자의 데이터를 가져온다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser()
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const foundComment = await commentRepository.findCommentWithUser(comment.id)

            expect(foundComment?.id).toBeDefined();
            expect(foundComment?.user).toBeDefined();
        })

        it('가져온 댓글의 데이터에 사용자의 비밀번호 정보가 없어야한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser()
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const searchedComment = await commentRepository.findCommentWithUser(comment.id)
            const foundComment = new SearchCommentResponseDto(searchedComment!)

            expect(foundComment.comment.user).not.toHaveProperty('password');
        })
    })

    describe('remove()', () => {
        it('댓글을 정상적으로 삭제한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser()
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            await commentRepository.removeOne(comment);

            const foundComment = await commentRepository.findCommentWithUser(comment.id);

            expect(foundComment).toBe(null);
        })
    })
})
