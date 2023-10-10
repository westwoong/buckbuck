import {validate} from "class-validator";
import {CreateCommentRequestDto} from "../dto/createComment.request.dto";

describe('CreateCommentRequestDto ', () => {
    describe('content 유효성 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            ['댓글 내용 테스트 입니다.', true],
            ['', false],
            ['이것은 댓글의 길이가 30글자를 넘어갔을 때 테스트입니다', false]
        ])('content 값이 유효하지않을 시 에러를 반환한다', async (content, isValid) => {
            createCommentRequestDto.content = content;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('proposalCost 유효성 검사', () => {
        const createCommentRequestDto = new CreateCommentRequestDto();
        it.each([
            [15000, true],
            [100001, false]
        ])('proposalCost 값이 유효하지않을 시 에러를 반환한다', async (proposalCost, isValid) => {
            createCommentRequestDto.proposalCost = proposalCost;
            const errors = await validate(createCommentRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })
})