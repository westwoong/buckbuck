import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource, Repository} from "typeorm";
import {PostEntity} from "../Post.entity";
import {UserEntity} from "../../users/User.entity";


describe('PostRepository (E2E)', () => {
    let app: INestApplication;
    let postRepository: Repository<PostEntity>
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        postRepository = dataSource.getRepository<PostEntity>(PostEntity);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('findOne()', () => {
        it('use relations -> get post with user data', async () => {
            // given
            const user = new UserEntity({
                account: "xptmxmlqslek123",
                password: "testpassword123",
                name: "홍길동",
                email: "test11r@example.com",
                phoneNumber: "01052828282",
                nickName: "빨리점11"
            })
            const savedUser = await dataSource.getRepository(UserEntity).save(user);
            const post = new PostEntity({
                title: '테스트 제목입니다.',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            })
            post.userId = savedUser.id;
            const savedPost = await postRepository.save(post);

            // when
            const foundPost = await postRepository.findOne({
                where: { id: savedPost.id },
                relations: ['user'],
            });

            // then
            expect(foundPost?.id).toBeDefined();
            expect(foundPost?.user).toBeDefined()
        })
    })
})
