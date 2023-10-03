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
import {CreatePostRequestDto} from "../dto/createPost.request.dto";
import {validate} from "class-validator";

describe('PostController (E2E)', () => {
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

    describe('게시글 작성 title 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['테스트 제목입니다', true],
            ['', false]
        ])('title 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (title, isValid) => {
            createPostRequestDto.title = title;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('게시글 작성 content 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['테스트 본문 내용입니다', true],
            ['', false]
        ])('content 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (content, isValid) => {
            createPostRequestDto.content = content;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('게시글 작성 cost 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [15000, true], // 정상
        ])('cost 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (cost, isValid) => {
            createPostRequestDto.cost = cost;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('게시글 작성 level 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['고수', true],
            ['', false]
        ])('level 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (level, isValid) => {
            createPostRequestDto.level = level;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('create Post', () => {
        it('게시글을 작성 시 body값이 fixture 값과 동일해야한다.', async () => {
            // Given = 테스트 사전 Fixture
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();

            const fixturePost = {
                title: '테스트 제목입니다.',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            }
            // When =
            const response = await request(app.getHttpServer())
                .post('/posts')
                .send(fixturePost)
                .set('Authorization', `Bearer ${userToken}`);
            // then
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(fixturePost.title);
            expect(response.body.content).toBe(fixturePost.content);
            expect(response.body.cost).toBe(fixturePost.cost);
            expect(response.body.level).toBe(fixturePost.level);
        })
    })

    describe('modify Post', () => {
        it('게시글 수정 시 httpcode 200으로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const postId = post.id;

            const modifyPost = {
                title: '수정 테스트 입니다..',
                content: '내용도 수정해볼게요',
                cost: 50000,
                level: '초급'
            }

            const response = await request(app.getHttpServer())
                .patch(`/posts/${postId}`)
                .send(modifyPost)
                .set('Authorization', `Bearer ${userToken}`);

            const fixedPost = await postFactory.getPost();
            console.log(fixedPost);
            expect(response.status).toBe(200);
        })
    })

    describe('delete Post', () => {
        it('게시글 삭제 시 httpcode 204로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const postId = post.id;

            const response = await request(app.getHttpServer())
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${userToken}`);

            const isExistPost = await postFactory.getPost();
            console.log(isExistPost);
            expect(response.status).toBe(204);
            expect(isExistPost).toHaveLength(0);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})
