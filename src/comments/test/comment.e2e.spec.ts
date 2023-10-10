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
import {CommentFactory} from "../../common/testSetup/comment/commentFactory";
import {CommentFinder} from "../../common/testSetup/comment/commentFinder";
import {UserFinder} from "../../common/testSetup/user/userFinder";

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

    describe('create Comment', () => {
        describe('httpcode 응답 값이 정상인지 확인한다.', () => {
            it('댓글 작성 시 201로 응답한다. ', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();

                const comment = {
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000
                }

                const response = await request(app.getHttpServer())
                    .post(`/comments/${post.id}`)
                    .send(comment)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(201);
            })

            it('content의 값이 비어있을 시 400으로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();

                const comment = {
                    proposalCost: 15000
                }
                const response = await request(app.getHttpServer())
                    .post(`/comments/${post.id}`)
                    .send(comment)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })

            it('proposalCost의 값이 비어있을 시 400으로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();

                const comment = {
                    content: '테스트 댓글 달아봅니다.',
                }
                const response = await request(app.getHttpServer())
                    .post(`/comments/${post.id}`)
                    .send(comment)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })

            it('userToken이 없을 시 401 코드로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                await userTokenFactory.createUser();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();

                const comment = {
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000
                }
                const response = await request(app.getHttpServer())
                    .post(`/comments/${post.id}`)
                    .send(comment)
                expect(response.status).toBe(401);
            })


        })

        it('입력한 데이터가 정상적으로 저장되었는지 확인한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            const comment = {
                content: '테스트 댓글 달아봅니다.',
                proposalCost: 15000
            }

            await request(app.getHttpServer())
                .post(`/comments/${post.id}`)
                .send(comment)
                .set('Authorization', `Bearer ${userToken}`);

            const commentFinder = new CommentFinder(dataSource);
            const savedComment = await commentFinder.getComment();

            expect(comment.content).toBe(savedComment!.content);
            expect(comment.proposalCost).toBe(savedComment!.proposalCost)
        })


    })

    describe('modify Comment', () => {
        describe('httpcode 응답 값이 정상인지 확인한다.', () => {
            it('댓글 수정 시 200으로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();
                const commentFactory = new CommentFactory(dataSource, userId, post.id);
                const comment = await commentFactory.createComment();

                const modifyComment = {
                    content: '테스트 댓글 수정해봅니다.',
                    proposalCost: 50500
                }
                const response = await request(app.getHttpServer())
                    .patch(`/comments/${comment.id}`)
                    .send(modifyComment)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(200);
            })

            it('content의 값이 비어있을 시 400으로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();
                const commentFactory = new CommentFactory(dataSource, userId, post.id);
                const comment = await commentFactory.createComment();

                const modifyComment = {
                    proposalCost: 50500
                }
                const response = await request(app.getHttpServer())
                    .patch(`/comments/${comment.id}`)
                    .send(modifyComment)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })

            it('proposalCost의 값이 비어있을 시 400으로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                const userToken = await userTokenFactory.createUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();
                const commentFactory = new CommentFactory(dataSource, userId, post.id);
                const comment = await commentFactory.createComment();

                const modifyComment = {
                    content: '테스트 댓글 수정해봅니다.',
                }
                const response = await request(app.getHttpServer())
                    .patch(`/comments/${comment.id}`)
                    .send(modifyComment)
                    .set('Authorization', `Bearer ${userToken}`);

                expect(response.status).toBe(400);
            })

            it('userToken이 없을 시 401 코드로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                await userTokenFactory.createUser();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();
                const commentFactory = new CommentFactory(dataSource, userId, post.id);
                const comment = await commentFactory.createComment();

                const modifyComment = {
                    content: '테스트 댓글 수정해봅니다.',
                    proposalCost: 50500
                }
                const response = await request(app.getHttpServer())
                    .patch(`/comments/${comment.id}`)
                    .send(modifyComment)
                expect(response.status).toBe(401);
            })

            it('수정 권한이 없을 시 403 코드로 응답한다.', async () => {
                const userTokenFactory = new UserTokenFactory(dataSource, authService);
                await userTokenFactory.createUser();
                const secondUserToken = await userTokenFactory.createSecondUserToken();
                const userFinder = new UserFinder(dataSource);
                const userId = await userFinder.userId();
                const postFactory = new PostFactory(dataSource, userId);
                const post = await postFactory.createPost();
                const commentFactory = new CommentFactory(dataSource, userId, post.id);
                const comment = await commentFactory.createComment();

                const modifyComment = {
                    content: '테스트 댓글 수정해봅니다.',
                    proposalCost: 50500
                }
                const response = await request(app.getHttpServer())
                    .patch(`/comments/${comment.id}`)
                    .send(modifyComment)
                    .set('Authorization', `Bearer ${secondUserToken}`);

                expect(response.status).toBe(403);
            })
        })

        it('댓글이 입력값으로 수정되었는지 확인한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const modifyComment = {
                content: '테스트 댓글 수정해봅니다.',
                proposalCost: 50500
            }

            await request(app.getHttpServer())
                .patch(`/comments/${comment.id}`)
                .send(modifyComment)
                .set('Authorization', `Bearer ${userToken}`);

            const commentFinder = new CommentFinder(dataSource);
            const modifiedComment = await commentFinder.getComment();

            expect(modifyComment.content).toBe(modifiedComment!.content);
            expect(modifyComment.proposalCost).toBe(modifiedComment!.proposalCost)
        })
    })

    describe('delete Comment', () => {
        it('댓글 삭제 시 httpcode 204로 응답한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const response = await request(app.getHttpServer())
                .delete(`/comments/${comment.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(204);
        })

        it('userToken이 없을 시 401 코드로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const response = await request(app.getHttpServer())
                .patch(`/comments/${comment.id}`)

            expect(response.status).toBe(401);
        })

        it('삭제 권한이 없을 시 403 코드로 응답한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            await userTokenFactory.createUser();
            const secondUserToken = await userTokenFactory.createSecondUserToken();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const response = await request(app.getHttpServer())
                .delete(`/comments/${comment.id}`)
                .set('Authorization', `Bearer ${secondUserToken}`);

            expect(response.status).toBe(403);
        })

        it('댓글이 삭제되었는지 확인한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource, authService);
            const userToken = await userTokenFactory.createUserToken();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            await request(app.getHttpServer())
                .delete(`/comments/${comment.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            const commentFinder = new CommentFinder(dataSource);
            const isExistComment = await commentFinder.getComment();
            expect(isExistComment).toBe(null);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})