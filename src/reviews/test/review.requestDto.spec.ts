import {validate} from "class-validator";
import {CreateReviewRequestDto} from "../dto/createReview.request.dto";

describe('CreateReviewRequestDto', () => {
    describe('stars 필드 validator 테스트 성공 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            [1],
            [2],
            [3],
            [4],
            [5]
        ])('입력한 별점이 1~5 사이일 시 error 의 길이가 0이여야한다.', async (stars) => {
            createReviewRequestDto.stars = stars;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('stars 필드 validator 테스트 실패 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            [6],
            [7],
            [8],
            [9],
            [10],
        ])('입력한 별점이 5점을 초과할 경우 에러가 발생한다.', async (stars) => {
            createReviewRequestDto.stars = stars;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })

    describe('content 필드 validator 테스트 성공 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            ['테스트 리뷰 작성입니다.'],
            ['리뷰 내용작성 테스트입니다.'],
            ['리뷰 내용작성 테스트입니다.'],
        ])('입력한 리뷰 내용의 값이 validator 에 위반될 시 에러가 발생한다.', async (comment) => {
            createReviewRequestDto.comment = comment;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('content 필드 validator 테스트 성공 검사', () => {
        const createReviewRequestDto = new CreateReviewRequestDto();
        it.each([
            [''],
            ['이것은 테스트 리뷰입니다 20글자가 넘으면 안됩니다'],
        ])('comment 값이 유효하지않을 시 에러를 반환한다', async (comment) => {
            createReviewRequestDto.comment = comment;
            const errors = await validate(createReviewRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })
})