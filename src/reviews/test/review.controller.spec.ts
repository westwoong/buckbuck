import {INestApplication, ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {DataSource} from "typeorm";
import {AuthService} from "../../auth/auth.service";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import * as request from "supertest";
import {UserService} from "../../users/user.service";

jest.mock('../review.service')

describe('ReviewController', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let authService: AuthService;
    let userService: UserService;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
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

    describe('/reviews (POST)', () => {
        it('정상적인 요청 시 201 응답코드를 반환한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({ userId: 1 })
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    stars: 5,
                    comment: '친절해요'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(201)
        })

        it('stars 값의 타입이 문자열일 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({ userId: 1 })
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    stars: '5점드릴게요',
                    comment: '친절해요'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('stars 의 값이 비어있을 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({ userId: 1 })
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    comment: '친절해요'
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('comment 값의 타입이 숫자일 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({ userId: 1 })
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    stars: '5점드릴게요',
                    comment: 8888
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('comment 의 값이 비어있을 시 400으로 응답한다.', async () => {
            await jest.spyOn(userService, 'findOneById').mockResolvedValue({userId: 1});
            const userToken = authService.signInWithJwt({ userId: 1 })
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    stars: 5,
                }).set('Authorization', `Bearer ${userToken}`)
                .expect(400)
        })

        it('userToken 이 없을 시 401 코드로 응답한다.', async () => {
            return request(app.getHttpServer())
                .post('/reviews/performers/:performerId')
                .send({
                    stars: 5,
                    comment: '친절해요'
                })
                .expect(401)
        })
    })
})