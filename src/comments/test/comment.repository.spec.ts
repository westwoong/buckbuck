import {INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../app.module';
import {initializeTransactionalContext} from 'typeorm-transactional';
import * as dotenv from 'dotenv';
import {DataSource, Repository} from "typeorm";
import {CommentEntity} from "../Comment.entity";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import {PostFactory} from "../../common/testSetup/post/postFactory";
import {CommentFactory} from "../../common/testSetup/comment/commentFactory";


describe('CommentRepository (E2E)', () => {
    let app: INestApplication;
    let commentRepository: Repository<CommentEntity>
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        commentRepository = dataSource.getRepository<CommentEntity>(CommentEntity);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('save()', () => {
        it('댓글을 정상적으로 저장한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource)
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();

            const comment = new CommentEntity({
                content: '테스트 댓글 달아봅니다.',
                proposalCost: 15000
            })
            comment.postId = post.id;
            comment.userId = userId;

            const savedComment = await commentRepository.save(comment);

            expect(savedComment.content).toBe(comment.content);
            expect(savedComment.proposalCost).toBe(comment.proposalCost);
            expect(savedComment.userId).toBeDefined();
            expect(savedComment.postId).toBeDefined();
        })

        it('댓글을 정상적으로 수정한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser()
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            expect(comment.content).toBe('테스트 댓글 달아봅니다.')
            expect(comment.proposalCost).toBe(15000);

            const modifyComment = {
                content: '테스트 댓글 수정해봅니다.',
                proposalCost: 50500
            }
            comment.content = modifyComment.content;
            comment.proposalCost = modifyComment.proposalCost;

            const modifiedComment = await commentRepository.save(comment);

            expect(modifiedComment.content).toBe(modifyComment.content)
        })
    })

    describe('findOne()', () => {
        it('relations 사용 시 댓글과 사용자의 데이터를 가져온다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser()
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();
            const postFactory = new PostFactory(dataSource, userId);
            const post = await postFactory.createPost();
            const commentFactory = new CommentFactory(dataSource, userId, post.id);
            const comment = await commentFactory.createComment();

            const foundComment = await commentRepository.findOne({
                where: {id: comment.id},
                relations: ['user']
            })

            expect(foundComment?.id).toBeDefined();
            expect(foundComment?.user).toBeDefined();
        })
    })
})
