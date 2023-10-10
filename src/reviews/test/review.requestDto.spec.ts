import {validate} from "class-validator";
import {CreateReviewRequestDto} from "../dto/createReview.request.dto";

describe('CreateReviewRequestDto', () => {
    describe('stars 유효성 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            [1, true],
            [2, true],
            [3, true],
            [4, true],
            [5, true],
            [6, false],
        ])('stars 값이 유효하지않을 시 에러를 반환한다.', async (stars, isValid) => {
            createReviewRequestDto.stars = stars;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('comment 유효성 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            ['테스트 리뷰 작성입니다.', true],
            ['', false],
            ['이것은 테스트 리뷰입니다 20글자가 넘으면 안됩니다', false],
        ])('comment 값이 유효하지않을 시 에러를 반환한다', async (comment, isValid) => {
            createReviewRequestDto.comment = comment;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })
})