import {INestApplication, ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import * as request from "supertest";

jest.mock('../categories.service')
describe('CategoryController', () => {
    let app: INestApplication;
    let categoryId = 1231;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    describe('/categories (POST)', () => {
        it('정상적인 요청시 201 응답코드를 반환한다.', async () => {
            return request(app.getHttpServer())
                .post('/categories')
                .send({
                    name: '해줘'
                })
                .expect(201)
        })

        it('name 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            return request(app.getHttpServer())
                .post('/categories')
                .expect(400)
        })
    })

    describe('/categories/:categoryId (PATCH)', () => {
        it('정상적인 요청 시 200 응답코드를 반환한다', async () => {
            return request(app.getHttpServer())
                .patch(`/categories/${categoryId}`)
                .send({
                    name: '수정해줘줘'
                })
                .expect(200)
        })

        it('categoryId 값이 정수형이 아닐 시 400 응답코드를 반환한다', async () => {
            return request(app.getHttpServer())
                .patch(`/categories/thisIsCategoryId`)
                .send({
                    name: '수정해줘줘'
                })
                .expect(400)
        })

        it('name 의 값이 비어있을 시 400 코드로 응답한다', async () => {
            return request(app.getHttpServer())
                .patch(`/categories/${categoryId}`)
                .expect(400)
        })
    })

    describe('/categories/:categoryId (DELETE)', () => {
        it('정상적인 요청 시 204 응답코드를 반환한다', async () => {
            return request(app.getHttpServer())
                .delete(`/categories/${categoryId}`)
                .expect(204)
        })

        it('categoryId 값이 정수형이 아닐 시 400 응답코드를 반환한다', async () => {
            return request(app.getHttpServer())
                .delete(`/categories/thisIsCategoryId`)
                .expect(400)
        })
    })

    afterAll(async () => {
        await app.close();
    })
})