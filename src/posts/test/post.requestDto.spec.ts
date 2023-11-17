import {CreatePostRequestDto} from "../dto/createPost.request.dto";
import {validate} from "class-validator";


describe('createPost RequestDto', () => {
    describe('title 필드 validator 테스트 성공 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['테스트 제목입니다'],
            ['!!!!오늘의 제목!!!!'],
            ['2020제목제목2020']
        ])('입력한 제목이 정상일 시 error 의 길이가 0이여야한다.', async (title) => {
            createPostRequestDto.title = title;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('title 필드 validator 테스트 실패 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [''],
            ['제목이 20글자를 넘어갔을 때 오류를 테스트합니다']
        ])('입력한 제목의 값이 validator 에 위반될 시 에러가 발생한다.', async (title) => {
            createPostRequestDto.title = title;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })

    describe('content 필드 validator 테스트 성공 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['테스트 본문 내용입니다'],
            ['오늘은 이런걸 해보려고했는데 어떠세요'],
            ['20일차 영차영차']
        ])('게시글 본문의 값이 정상일 시 error 의 길이가 0이여야한다.', async (content) => {
            createPostRequestDto.content = content;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('content 필드 validator 테스트 실패 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [''],
            ['이것은 본문의 길이가 30글자가 넘어갔을 때 테스트입니다']
        ])('게시글 본문의 값이 validator 에 위반될 시 에러가 발생한다.', async (content) => {
            createPostRequestDto.content = content;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })

    describe('cost 필드 validator 테스트 성공 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [15000],
            [55000],
            [100000]
        ])('의뢰금액이 10만원 이하일 시 error 의 길이가 0이여야한다.', async (cost) => {
            createPostRequestDto.cost = cost;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('cost 필드 validator 테스트 실패 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [100001],
            [200000],
        ])('의뢰금액이 10만원을 초과할 시 에러가 발생한다', async (cost) => {
            createPostRequestDto.cost = cost;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })

    describe('level 필드 validator 테스트 성공 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['초급'],
            ['중급'],
            ['고급'],
            ['어려워요'],
            ['쉬울거같아요'],
            ['모르겠어요']
        ])('의뢰 난이도의 값이 정상일 시 error 의 길이가 0이여야한다.', async (level) => {
            createPostRequestDto.level = level;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('level 필드 validator 테스트 실패 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [''],
            ['의뢰 난이도의 길이가 10글자가 넘어갔을 때 테스트입니다.']
        ])('의뢰 난이도의 값이 validator 에 위반될 시 에러가 발생한다/', async (level) => {
            createPostRequestDto.level = level;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })
})
