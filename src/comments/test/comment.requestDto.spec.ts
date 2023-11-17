import {validate} from "class-validator";
import {CreateCommentRequestDto} from "../dto/createComment.request.dto";

describe('CreateCommentRequestDto ', () => {
    describe('content 필드 validator 테스트 성공 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            ['댓글 내용 테스트 입니다.'],
            ['12345 댓글 작성'],
            ['⭐️ 다섯개~'],
        ])('입력한 댓글의 값이 정상일 시 error 의 길이가 0이여야한다.', async (content) => {
            createCommentRequestDto.content = content;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});
            expect(errors).toHaveLength(0);
        })
    })

    describe('content 필드 validator 테스트 실패 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            [''],
            ['이것은 댓글의 길이가 30글자를 넘어갔을 때 테스트입니다']
        ])('입력한 댓글의 값이 validator 에 위반될 시 에러가 발생한다.', async (content) => {
            createCommentRequestDto.content = content;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});
            expect(errors).not.toHaveLength(0);
        })
    })

    describe('proposalCost 필드 validator 테스트 성공 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            [20000],
            [40000],
            [60000],
            [100000]
        ])('제안 금액이 10만원 이하일 때 error 의 길이가 0이여야한다.', async (proposalCost) => {
            createCommentRequestDto.proposalCost = proposalCost;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('proposalCost 필드 validator 테스트 실패 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            [100001],
            [200000]
        ])('제안 금액이 10만원을 초과할 시 error 가 발생한다.', async (proposalCost) => {
            createCommentRequestDto.proposalCost = proposalCost;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })
})