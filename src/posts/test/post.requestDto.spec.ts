import {CreatePostRequestDto} from "../dto/createPost.request.dto";
import {validate} from "class-validator";


describe('createPost RequestDto', () => {
    describe('title 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['테스트 제목입니다', true],
            ['', false],
            ['제목이 20글자를 넘어갔을 때 오류를 테스트합니다', false]
        ])('title 값이 유효하지않을 시 에러를 반환한다', async (title, isValid) => {
            createPostRequestDto.title = title;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('content 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['테스트 본문 내용입니다', true],
            ['', false],
            ['이것은 본문의 길이가 30글자가 넘어갔을 때 테스트입니다', false]
        ])('content 값이 유효하지않을 시 에러를 반환한다', async (content, isValid) => {
            createPostRequestDto.content = content;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('cost 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            [15000, true], // 정상
            [1, true],
            [100001, false]
        ])('cost 값이 유효하지않을 시 에러를 반환한다', async (cost, isValid) => {
            createPostRequestDto.cost = cost;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })

    describe('level 유효성 검사', () => {
        const createPostRequestDto = new CreatePostRequestDto();
        it.each([
            ['고수', true],
            ['', false],
            ['level의 길이가 10글자가 넘어갔을 때 테스트입니다.',false]
        ])('level 값이 유효하지않을 시 에러를 반환한다', async (level, isValid) => {
            createPostRequestDto.level = level;
            const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })
})
