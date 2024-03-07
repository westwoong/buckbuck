import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource} from "typeorm";
import {PostEntity} from "../Post.entity";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import {PostFactory} from "../../common/testSetup/post/postFactory";
import {CommentFactory} from "../../common/testSetup/comment/commentFactory";
import {TypeormPostRepository} from "../typeormPost.repository";
import {COMMENT_REPOSITORY, POST_REPOSITORY} from "../../common/injectToken.constant";
import {TypeormCommentRepository} from "../../comments/typeormComment.repository";
import {GetPostsResponseDto} from "../dto/getPosts.response.dto";
import * as path from "path";


describe('PostRepository (E2E)', () => {
    let app: INestApplication;
    let postRepository: TypeormPostRepository;
    let commentRepository: TypeormCommentRepository;
    let dataSource: DataSource;

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
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        commentRepository = moduleRef.get<TypeormCommentRepository>(COMMENT_REPOSITORY);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
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
                level: '고수',
                userId: user.id
            })

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

    describe('getPostsSortedDescending()', () => {
        it('게시글 조회 시 nickName, commentCount 필드가 포함되어있어야한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            await postFactory.createPost();

            let page = 1
            const posts = await postRepository.getPostsSortedDescending(page);
            const formatterPosts = new GetPostsResponseDto(posts);

            expect(formatterPosts.posts[0]).toHaveProperty('nickName');
            expect(formatterPosts.posts[0]).toHaveProperty('commentCount')
        })
    })

    describe('findPostWithUserByPostId()', () => {
        it('게시글 검색 시 사용자의 정보도 같이 조회한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            const foundPost = await postRepository.findPostWithUserByPostId(post.id);

            expect(foundPost?.id).toBeDefined();
            expect(foundPost?.user).toBeDefined()
        })
    })

    describe('findOneById()', () => {
        it('게시글에 user, comments 객체가 있는지 확인한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            await commentFactory.createComment();

            const foundPost = await postRepository.findOneById(post.id);

            expect(foundPost?.user).toBeDefined();
            expect(foundPost?.comment).toBeDefined();
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

            const foundPost = await postRepository.findOneById(post.id);

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

            const comments = await commentRepository.findAllByPost(post);

            await commentRepository.removeAll(comments);
            await postRepository.remove(post);

            const foundPost = await postRepository.findOneById(post.id);
            expect(foundPost).toBe(null);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})
