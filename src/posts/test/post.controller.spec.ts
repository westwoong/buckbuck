import {INestApplication, ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from "supertest";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../users/user.service";
import path from "path";

jest.mock('../post.service');

describe('PostController', () => {
    let app: INestApplication;
    let authService: AuthService;
    let userService: UserService;

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

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    describe('/posts (GET)', () => {
        it('정상적인 요청 시 200 응답코드를 반환한다.', async () => {
            return request(app.getHttpServer())
                .get('/posts?page=1')
                .expect(200);
        })

        it('page 파라미터에 숫자가 아닌 타입을 넣으면 400 응답코드를 반환한다.', async () => {
            return request(app.getHttpServer())
                .get(`/posts?page=isTestFail`)
                .expect(400)
        })
    })

    describe('/posts/:postId (GET)', () => {
        it('정상적인 요청 시 200 응답코드를 반환한다', async () => {
            return request(app.getHttpServer())
                .get('/posts/1')
                .expect(200);
        })

        it('postId가 숫자가 아닐 시 400 응답코드를 반환한다.', async () => {
            return request(app.getHttpServer())
                .get('/posts/thisIsPostId')
                .expect(400);
        })
    })

    describe('/posts (POST)', () => {
        it('정상적인 요청 시 201 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(201)
        })

        it('title 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('content 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    cost: 10500,
                    level: '고수'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('level 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('userToken 이 없을 시 401 코드로 응답한다', async () => {
            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: '테스트 제목입니다.',
                    content: '테스트 내용입니다.',
                    cost: 10500,
                    level: '고수'
                })
                .expect(401);
        })
    })

    describe('/posts/:postId (PATCH)', () => {
        it('정상적인 요청 시 200 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            return request(app.getHttpServer())
                .patch('/posts/1')
                .send({
                    title: '수정 테스트 입니다..',
                    content: '내용도 수정해볼게요',
                    cost: 50000,
                    level: '초급'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(200)
        })

        it('postId의 값이 정수형이 아닐 시 400 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            return request(app.getHttpServer())
                .patch('/posts/thisIsPostId')
                .send({
                    title: '수정 테스트 입니다..',
                    content: '내용도 수정해볼게요',
                    cost: 50000,
                    level: '초급'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('title 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch(`/posts/1`)
                .send({
                    content: '내용도 수정해볼게요',
                    cost: 50000,
                    level: '초급'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('content 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch('/posts/1')
                .send({
                    title: '테스트 제목입니다.',
                    cost: 50000,
                    level: '초급'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('level 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})

            return request(app.getHttpServer())
                .patch('/posts/1')
                .send({
                    title: '수정 테스트 입니다..',
                    content: '내용도 수정해볼게요',
                    cost: 50000,
                })
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);
        })

        it('userToken 이 없을 시 401 코드로 응답한다', async () => {
            return request(app.getHttpServer())
                .patch('/posts/1')
                .send({
                    title: '수정 테스트 입니다..',
                    content: '내용도 수정해볼게요',
                    cost: 50000,
                    level: '초급'
                })
                .expect(401);
        })
    })

    describe('/posts/:postId (DELETE)', () => {
        it('정상적인 삭제 요청 시 204 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            return request(app.getHttpServer())
                .delete('/posts/1')
                .send()
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204)
        })

        it('삭제하려는 postId의 값이 정수형이 아닐 시 400 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({userId: 1})
            return request(app.getHttpServer())
                .delete('/posts/deletePostId')
                .send()
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })
    })

    afterAll(async () => {
        await app.close();
    })
})