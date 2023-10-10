import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource, Repository} from "typeorm";
import {PostEntity} from "../Post.entity";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import {PostFactory} from "../../common/testSetup/post/postFactory";
import {CommentFactory} from "../../common/testSetup/comment/commentFactory";
import {CommentEntity} from "../../comments/Comment.entity";


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

        it('findOne 사용 시 게시글의 데이터를 가져온다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            const foundPost = await postRepository.findOne({
                where: {id: post.id},
            });

            expect(foundPost?.title).toBe(post.title);
            expect(foundPost?.content).toBe(post.content);
            expect(foundPost?.cost).toBe(post.cost);
            expect(foundPost?.level).toBe(post.level);


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

        it('댓글이 달린 게시글 삭제 시 댓글과 같이 삭제한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            await commentFactory.createComment();

            const comments = await dataSource.getRepository<CommentEntity>(CommentEntity).find({
                where: {
                    post: post
                }
            })
            await dataSource.getRepository<CommentEntity>(CommentEntity).remove(comments)
            await postRepository.remove(post);

            const foundPost = await postRepository.findOne({
                where: {id: post.id},
            });
            expect(foundPost).toBe(null);
        })
    })
})
