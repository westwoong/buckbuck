import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import * as request from 'supertest';
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from '../../common/testSetup/userTokenFactory'
import {PostFactory} from "../../common/testSetup/postFactory";
import {CommentFactory} from "../../common/testSetup/commentFactory";
import {validate} from "class-validator";
import {CreateCommentRequestDto} from "../dto/createComment.request.dto";

describe('CommentController (E2E)', () => {
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

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('댓글 작성 content 유효성 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            ['댓글 내용 테스트 입니다.', true],
            ['', false]
        ])('content 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (content, isValid) => {
            createCommentRequestDto.content = content;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('댓글 작성 proposalCost 유효성 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            [15000, true],
        ])('content 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (proposalCost, isValid) => {
            createCommentRequestDto.proposalCost = proposalCost;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('create Comment', () => {
        it('댓글 작성 시 httpcode 201로 응답한다. ', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            const fixtureComment = {
                content: '테스트 댓글 달아봅니다.',
                proposalCost: 15000
            }

            const response = await request(app.getHttpServer())
                .post(`/comments/${post.id}`)
                .send(fixtureComment)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(201);
            expect(response.body.content).toBe(fixtureComment.content);
            expect(response.body.proposalCost).toBe(fixtureComment.proposalCost);
        })
    })

    describe('modify Comment', () => {
        it('댓글 수정 시 httpcode 200으로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const modifyComment = {
                content: '테스트 댓글 달아봅니다.',
                proposalCost: 15000
            }

            const response = await request(app.getHttpServer())
                .patch(`/comments/${comment.id}`)
                .send(modifyComment)
                .set('Authorization', `Bearer ${userToken}`);

            const fixedComment = await commentFactory.getComment();
            console.log(fixedComment)
            expect(response.status).toBe(200);
        })
    })

    describe('delete Comment', () => {
        it('댓글 삭제 시 getComment()의 length가 0이여야한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const response = await request(app.getHttpServer())
                .delete(`/comments/${comment.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            const isExistComment = await commentFactory.getComment();
            expect(response.status).toBe(204);
            expect(isExistComment).toHaveLength(0);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})