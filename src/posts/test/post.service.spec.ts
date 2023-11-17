import {
    ForbiddenException,
    INestApplication,
    NotFoundException,
    ValidationPipe
} from "@nestjs/common";
import {PostService} from "../post.service";
import {TypeormPostRepository} from "../typeormPost.repository";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {COMMENT_REPOSITORY, POST_REPOSITORY, USER_REPOSITORY} from "../../common/injectToken.constant";
import {TypeormUserRepository} from "../../users/typeormUser.repository";
import {DUMMY_COMMENT_RESOLVE, DUMMY_POST_RESOLVE, DUMMY_USER_RESOLVE} from "../../common/mockDummyResolve";
import {PostEntity} from "../Post.entity";
import {TypeormCommentRepository} from "../../comments/typeormComment.repository";

jest.mock('../../users/typeormUser.repository');
jest.mock('../../comments/typeormComment.repository');
jest.mock('../typeormPost.repository');
jest.mock('typeorm-transactional', () => {
    return {
        Transactional: () => () => ({})
    }
})

describe('PostService', () => {
    let app: INestApplication;
    let postService: PostService;
    let userRepository: TypeormUserRepository;
    let postRepository: TypeormPostRepository;
    let commentRepository: TypeormCommentRepository;

    let userId = 155;
    let postId = 155;

    beforeAll(async () => {
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {provide: POST_REPOSITORY, useClass: TypeormPostRepository},
                {provide: USER_REPOSITORY, useClass: TypeormUserRepository},
                {provide: COMMENT_REPOSITORY, useClass: TypeormCommentRepository}]
        }).compile();

        postService = moduleRef.get<PostService>(PostService);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        commentRepository = moduleRef.get<TypeormCommentRepository>(COMMENT_REPOSITORY);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    })

    describe('modify Post', () => {
        it('수정할 게시글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            const post = new PostEntity({
                title: '수정용 제목',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            })
            post.userId = userId;
            await jest.spyOn(postRepository, 'findPostWithUserByPostId').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findOneById').mockResolvedValue(DUMMY_USER_RESOLVE);
            await jest.spyOn(postRepository, 'save').mockResolvedValue(DUMMY_POST_RESOLVE);
            await expect(postService.modify(userId, postId, post)).rejects.toThrow(NotFoundException);

        })

        it('본인의 게시글이 아닌것을 수정할 시 403 에러를 반환한다', async () => {
            const post = new PostEntity({
                title: '수정용 제목',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수'
            })
            post.userId = 5;
            await jest.spyOn(postRepository, 'findPostWithUserByPostId').mockResolvedValue(post);
            await jest.spyOn(postRepository, 'save').mockResolvedValue(DUMMY_POST_RESOLVE);
            await expect(postService.modify(userId, postId, DUMMY_POST_RESOLVE)).rejects.toThrow(ForbiddenException);
        })
    })

    describe('delete Post', () => {
        it('삭제할 게시글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            await jest.spyOn(postRepository, 'findPostWithUserByPostId').mockResolvedValue(null);
            await jest.spyOn(commentRepository, 'findAllByPost').mockResolvedValue([DUMMY_COMMENT_RESOLVE]);
            await jest.spyOn(commentRepository, 'removeAll').mockResolvedValue([DUMMY_COMMENT_RESOLVE]);
            await jest.spyOn(postRepository, 'remove').mockResolvedValue(DUMMY_POST_RESOLVE);
            await expect(postService.delete(userId, postId)).rejects.toThrow(NotFoundException);
        })

        it('본인의 게시글이 아닌것을 삭제할 시 403 에러를 반환한다', async () => {
            DUMMY_POST_RESOLVE.userId = 5;
            await jest.spyOn(postRepository, 'findPostWithUserByPostId').mockResolvedValue(DUMMY_POST_RESOLVE);
            await jest.spyOn(commentRepository, 'findAllByPost').mockResolvedValue([DUMMY_COMMENT_RESOLVE]);
            await jest.spyOn(commentRepository, 'removeAll').mockResolvedValue([DUMMY_COMMENT_RESOLVE]);
            await jest.spyOn(postRepository, 'remove').mockResolvedValue(DUMMY_POST_RESOLVE);
            await expect(postService.delete(userId, postId)).rejects.toThrow(ForbiddenException);
        })
    })
})