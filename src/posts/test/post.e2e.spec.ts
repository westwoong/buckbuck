import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import * as request from 'supertest';
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from '../../common/testSetup/user/userTokenFactory'
import {PostFactory} from "../../common/testSetup/post/postFactory";
import {PostFinder} from "../../common/testSetup/post/postFinder";

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

    describe('create Post', () => {
        describe('httpcode 응답 값이 정상인지 확인한다.', () => {
            it('게시글을 작성 시 201 코드로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();

                const post = {
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }

                const response = await request(app.getHttpServer())
                    .post('/posts')
                    .send(post)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(201);
            })

            it('title의 값이 비어있을 시 400 코드로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();

                const post = {
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }

                const response = await request(app.getHttpServer())
                    .post('/posts')
                    .send(post)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })

            it('content의 값이 비어있을 시 400 코드로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();

                const post = {
                    title: '테스트 제목입니다.',
                    cost: 10500,
                    level: '고수'
                }

                const response = await request(app.getHttpServer())
                    .post('/posts')
                    .send(post)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })

            it('level의 값이 비어있을 시 400 코드로 응답한다', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();

                const post = {
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500
                }

                const response = await request(app.getHttpServer())
                    .post('/posts')
                    .send(post)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })
        })

        describe('게시글이 정상적으로 저장되었는지 확인한다.', () => {
            it('입력한 데이터가 정상적으로 저장되었는지 확인한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const postFinder = new PostFinder(dataSource);

                const post = {
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }

                await request(app.getHttpServer())
                    .post('/posts')
                    .send(post)
                    .set('Authorization', `Bearer ${userToken}`);

                const savedPost = await postFinder.getPost();
                expect(post.title).toBe(savedPost!.title);
                expect(post.content).toBe(savedPost!.content);
                expect(post.cost).toBe(savedPost!.cost);
                expect(post.level).toBe(savedPost!.level);
            })
        })
    })

    describe('modify Post', () => {
        it('게시글 수정 시 200 코드로 응답한다', async () => {
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

            expect(response.status).toBe(200);
        })

        it('게시글 수정 시 DB의 데이터가 수정되었는지 확인한다.', async () => {
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

            await request(app.getHttpServer())
                .patch(`/posts/${postId}`)
                .send(modifyPost)
                .set('Authorization', `Bearer ${userToken}`);

            const postFinder = new PostFinder(dataSource);
            const savedPost = await postFinder.getPost();

            expect(modifyPost.title).toBe(savedPost!.title);
            expect(modifyPost.content).toBe(savedPost!.content);
            expect(modifyPost.cost).toBe(savedPost!.cost);
            expect(modifyPost.level).toBe(savedPost!.level);
        })
    })

    describe('delete Post', () => {
        it('게시글 삭제 시 204 코드로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const postId = post.id;

            const response = await request(app.getHttpServer())
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(204);
        })

        it('게시글 삭제 가 정상적으로 이루어졌는지 확인한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userId = await userTokenFactory.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const postId = post.id;

            await request(app.getHttpServer())
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${userToken}`);

            const postFinder = new PostFinder(dataSource);
            const isExistPost = await postFinder.getPost();
            expect(isExistPost).toBe(null);
        })
    })

    afterAll(async () => {
        await app.close();
    });
})
