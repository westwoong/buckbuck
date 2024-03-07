import {
    ForbiddenException,
    INestApplication,
    NotFoundException,
    ValidationPipe
} from "@nestjs/common";
import {CommentService} from "../comment.service";
import {TypeormCommentRepository} from "../typeormComment.repository";
import * as dotenv from 'dotenv';
import {Test, TestingModule} from "@nestjs/testing";
import {COMMENT_REPOSITORY, POST_REPOSITORY, USER_REPOSITORY} from "../../common/injectToken.constant";
import {CommentEntity} from "../Comment.entity";
import {TypeormUserRepository} from "../../users/typeormUser.repository";
import {TypeormPostRepository} from "../../posts/typeormPost.repository";
import {DUMMY_COMMENT_RESOLVE, DUMMY_POST_RESOLVE} from "../../common/mockDummyResolve";
import path from "path";

jest.mock('../typeormComment.repository');
jest.mock('../../users/typeormUser.repository');
jest.mock('../../posts/typeormPost.repository');
jest.mock('typeorm-transactional', () => {
    return {
        Transactional: () => () => ({})
    }
})

describe('CommentService', () => {
    let app: INestApplication;
    let commentService: CommentService;
    let commentRepository: TypeormCommentRepository;
    let userRepository: TypeormUserRepository;
    let postRepository: TypeormPostRepository;
    let userId = 1231;
    let commentId = 1231;
    let postId = 1231;
    let page = 1;

    beforeAll(async () => {
        dotenv.config({
            path: path.resolve(
                process.env.NODE_ENV === 'product' ? '.env.product' :
                    process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
            )
        });
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {provide: COMMENT_REPOSITORY, useClass: TypeormCommentRepository},
                {provide: POST_REPOSITORY, useClass: TypeormPostRepository},
                {provide: USER_REPOSITORY, useClass: TypeormUserRepository}],
        }).compile();

        commentService = moduleRef.get<CommentService>(CommentService);
        commentRepository = moduleRef.get<TypeormCommentRepository>(COMMENT_REPOSITORY);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        postRepository = moduleRef.get<TypeormPostRepository>(POST_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    });

    describe('create Comment', () => {
        it('게시글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            const comment = new CommentEntity({content: '테스트 댓글', proposalCost: 1000, postId, userId});
            await jest.spyOn(postRepository, 'findOneById').mockResolvedValue(null);
            await expect(commentService.create(userId, postId, comment)).rejects.toThrow(NotFoundException);
        })
    })

    describe('modify Comment', () => {
        it('수정할 댓글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            const comment = new CommentEntity({content: '테스트 댓글', proposalCost: 1000, postId, userId});
            await jest.spyOn(commentRepository, 'findCommentWithUser').mockResolvedValue(null);
            await expect(commentService.modify(userId, commentId, comment)).rejects.toThrow(NotFoundException);
        })

        it('수정 요청을 하는 userId가 댓글의 userId 값과 같지 않으면 403에러를 반환한다', async () => {
            const comment = new CommentEntity({content: '테스트 댓글', proposalCost: 1000, userId, postId});
            await jest.spyOn(commentRepository, 'findCommentWithUser').mockResolvedValue(DUMMY_COMMENT_RESOLVE);
            await expect(commentService.modify(userId, commentId, comment)).rejects.toThrow(ForbiddenException);
        })
    })

    describe('delete Comment', () => {
        it('삭제할 댓글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            await jest.spyOn(commentRepository, 'findCommentWithUser').mockResolvedValue(null)
            await expect(commentService.delete(userId, commentId)).rejects.toThrow(NotFoundException);
        })

        it('삭제 요청을하는 userId 와 댓글의 userId가 같지 않을 시 403에러를 반환한다', async () => {
            DUMMY_COMMENT_RESOLVE.userId = 5555;
            await jest.spyOn(commentRepository, 'findCommentWithUser').mockResolvedValue(DUMMY_COMMENT_RESOLVE);
            await jest.spyOn(commentRepository, 'removeOne').mockResolvedValue(DUMMY_COMMENT_RESOLVE);

            await expect(commentService.delete(userId, commentId)).rejects.toThrow(ForbiddenException);
        })
    })

    describe('searchByCommentId()', () => {
        it('검색한 댓글이 존재하지 않을 시 404 에러를 반환한다', async () => {
            await jest.spyOn(commentRepository, 'findCommentWithUser').mockResolvedValue(null);
            await expect(commentService.searchByCommentId(commentId)).rejects.toThrow(NotFoundException);
        })
    })

    describe('searchCommentByPostId', () => {
        it('댓글을 조회할 게시글이 존재하지 않을 시 404 에러를 반환한다.', async () => {
            await jest.spyOn(postRepository, 'findOneById').mockResolvedValue(null);
            await expect(commentService.searchCommentByPostId(postId, page)).rejects.toThrow(NotFoundException)
        })

        it('해당 게시글에 댓글이 존재하지 않을 시 "comments"가 빈 배열이여야 한다.', async () => {
            await jest.spyOn(postRepository, 'findOneById').mockResolvedValue(DUMMY_POST_RESOLVE);
            await jest.spyOn(commentRepository, 'getCommentByPostIdSortedDescending').mockResolvedValue(null);
            await expect(commentService.searchCommentByPostId(postId, page))
                .resolves
                .toEqual({
                    "comments": []
                });
        })
    })

    afterAll(async () => {
        await app.close();
    })
})