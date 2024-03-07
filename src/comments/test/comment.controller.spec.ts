import {INestApplication, ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from "supertest";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../users/user.service";
import * as path from "path";

jest.mock('../comment.service');

describe('CommentController', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let authService: AuthService;
    let userService: UserService;
    let postId = 1;
    let commentId = 1;

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

        dataSource = moduleRef.get<DataSource>(DataSource);
        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    describe('/comments/post/:postId (GET)', () => {
        it('검색 권한이 있을 시 200 코드로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .get(`/comments/post/${postId}?commentPage=1`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200)
        })

        it('commentPage 값이 정수형이 아닌경우 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .get(`/comments/post/${postId}?commentPage=pageNumber`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('postId 값이 정수형이 아닌경우 400 코드로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .get(`/comments/post/thisIsPostId?commentPage=1`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('userToken 이 없을 시 401 코드로 응답한다', async () => {
            await request(app.getHttpServer())
                .get(`/comments/post/${postId}`)
                .expect(401);
        })
    })

    describe('/comments/:commentId (GET)', () => {
        it('검색 권한이 있을 시 200 코드로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .get(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200)
        })

        it('commentId 값이 정수형이 아닌경우 400 코드로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .get(`/comments/thisIsCommentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('userToken 이 없을 시 401 코드로 응답한다', async () => {
            await request(app.getHttpServer())
                .get(`/comments/${commentId}`)
                .expect(401);
        })
    })

    describe('/comments/:postId (POST)', () => {
        it('정상적인 요청 시 201 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .post(`/comments/${postId}`)
                .send({
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(201)
        })

        it('postId 값이 정수형이 아닐 시 400 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            await request(app.getHttpServer())
                .post(`/comments/thisIsPostId`)
                .send({
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('content 의 값이 비어있을 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .post(`/comments/:postId`)
                .send({proposalCost: 15000})
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('proposalCost 의 값이 비어있을 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .post(`/comments/:postId`)
                .send({content: '테스트 댓글 달아봅니다.'})
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('userToken 이 없을 시 401 코드로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post(`/comments/:postId`)
                .send({
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000
                })
                .expect(401);
        })
    })

    describe('/comments/:commentId (PATCH)', () => {
        it('정상적인 요청 시 200 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch(`/comments/${commentId}`)
                .send({
                    content: '테스트 댓글 수정해봅니다.',
                    proposalCost: 50500
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
        })

        it('commentId 값이 정수형이 아닐 시 400 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch(`/comments/thisIsCommentId`)
                .send({
                    content: '테스트 댓글 수정해봅니다.',
                    proposalCost: 50500
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('content 의 값이 비어있을 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch(`/comments/:commentId`)
                .send({proposalCost: 50500})
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('proposalCost 의 값이 비어있을 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch(`/comments/:commentId`)
                .send({content: '테스트 댓글 수정해봅니다.'})
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('userToken 이 없을 시 401 코드로 응답한다.', async () => {
            return request(app.getHttpServer())
                .patch(`/comments/:commentId`)
                .send({
                    content: '테스트 댓글 달아봅니다.',
                    proposalCost: 15000
                })
                .expect(401);
        })
    })

    describe('/comments/:commentId (DELETE)', () => {
        it('정상적인 요청 시 204 응답코드를 반환한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .delete(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204)
        })

        it('commentId 값이 정수형이 아닐 시 400 응답코드를 반환한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .delete(`/comments/thisIsCommentId`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('userToken 이 없을 시 401 코드로 응답한다.', async () => {
            return request(app.getHttpServer())
                .delete(`/comments/:commentId`)
                .expect(401);
        })
    })

    afterAll(async () => {
        await app.close();
    })
});