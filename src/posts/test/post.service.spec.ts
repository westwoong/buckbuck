import {
    BadRequestException,
    ForbiddenException,
    INestApplication,
    NotFoundException,
    ValidationPipe
} from "@nestjs/common";
import {PostService} from "../post.service";
import {TypeormPostRepository} from "../typeormPost.repository";
import {Test, TestingModule} from "@nestjs/testing";
import {
    COMMENT_REPOSITORY,
    POST_REPOSITORY,
    UPLOAD_REPOSITORY,
    USER_REPOSITORY
} from "../../common/injectToken.constant";
import {TypeormUserRepository} from "../../users/typeormUser.repository";
import {DUMMY_COMMENT_RESOLVE, DUMMY_POST_RESOLVE, DUMMY_USER_RESOLVE} from "../../common/mockDummyResolve";
import {PostEntity} from "../Post.entity";
import {TypeormCommentRepository} from "../../comments/typeormComment.repository";
import {TypeormUploadRepository} from "../../uploads/typeormUpload.repository";

jest.mock('../../users/typeormUser.repository');
jest.mock('../../comments/typeormComment.repository');
jest.mock('../../uploads/typeormUpload.repository');
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
    let uploadRepository: TypeormUploadRepository;

    let userId = 155;
    let postId = 155;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {provide: POST_REPOSITORY, useClass: TypeormPostRepository},
                {provide: USER_REPOSITORY, useClass: TypeormUserRepository},
                {provide: COMMENT_REPOSITORY, useClass: TypeormCommentRepository},
                {provide: UPLOAD_REPOSITORY, useClass: TypeormUploadRepository}
            ]
        }).compile();

        postService = moduleRef.get<PostService>(PostService);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        commentRepository = moduleRef.get<TypeormCommentRepository>(COMMENT_REPOSITORY);
        uploadRepository = moduleRef.get<TypeormUploadRepository>(UPLOAD_REPOSITORY);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    })

    describe('get Posts', () => {
        it('게시글 전체 조회 시 page 값이 없으면 400 에러를 반환한다', async () => {
            // @ts-ignore
            await expect(postService.getPosts(null)).rejects.toThrow(BadRequestException)
        })
    })

    describe('get Post', () => {
        it('조회할 게시글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            await jest.spyOn(postRepository, 'findOneById').mockResolvedValue(null);
            await expect(postService.getPostById(postId)).rejects.toThrow(NotFoundException);
        })
    })

    describe('modify Post', () => {
        it('수정할 게시글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            const post = new PostEntity({
                title: '수정용 제목',
                content: '테스트 내용입니다.',
                cost: 10500,
                level: '고수',
                userId
            })

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
                level: '고수',
                userId: 5
            })
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

    afterAll(async () => {
        await app.close();
    })
})