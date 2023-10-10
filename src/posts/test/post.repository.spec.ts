import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource, Repository} from "typeorm";
import {PostEntity} from "../Post.entity";
import {UserEntity} from "../../users/User.entity";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import {PostFactory} from "../../common/testSetup/post/postFactory";


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

    describe('save()', () => {
        it('게시글을 정상적으로 저장한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            const user = await userTokenFactory.createUser();

            const post = new PostEntity({
                title: '테스트 제목입니다.',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            })
            post.userId = user.id;

            const savedPost = await postRepository.save(post);
            expect(savedPost.title).toBe(post.title);
            expect(savedPost.content).toBe(post.content);
            expect(savedPost.cost).toBe(post.cost);
            expect(savedPost.level).toBe(post.level);
            expect(savedPost.userId).toBe(user.id);
            expect(savedPost.user).toBeDefined();
        })

        it('게시글을 정상적으로 수정한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            expect(post.title).toBe('테스트 제목입니다.')

            const modifyPost = {
                title: '수정 테스트 입니다..',
                content: '내용도 수정해볼게요',
                cost: 50000,
                level: '초급'
            }

            post.title = modifyPost.title;
            post.content = modifyPost.content;
            post.cost = modifyPost.cost;
            post.level = modifyPost.level;

            await postRepository.save(post);

            expect(post.title).toBe(modifyPost.title);
            expect(post.content).toBe(modifyPost.content);
            expect(post.cost).toBe(modifyPost.cost);
            expect(post.level).toBe(modifyPost.level);
        })

    })

    describe('findOne()', () => {
        it('relations 옵션 사용 시 게시글과 사용자의 데이터를 가져온다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            // when
            const foundPost = await postRepository.findOne({
                where: {id: post.id},
                relations: ['user'],
            });

            // then
            expect(foundPost?.id).toBeDefined();
            expect(foundPost?.user).toBeDefined()
        })
    })

    describe('remove()', () => {
        it('게시글을 정상적으로 삭제한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            await postRepository.remove(post);

            const foundPost = await postRepository.findOne({
                where: {id: post.id},
            });

            expect(foundPost).toBe(null);
        })
    })
})
