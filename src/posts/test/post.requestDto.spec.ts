import {CreatePostRequestDto} from "../dto/createPost.request.dto";
import {validate} from "class-validator";


describe('createPost RequestDto', () => {
    describe('게시글 작성 API', () => {
        describe('title 유효성 검사', () => {
            const createPostRequestDto = new CreatePostRequestDto();
            it.each([
                ['테스트 제목입니다', true],
                ['', false]
            ])('title 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (title, isValid) => {
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
                ['', false]
            ])('content 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (content, isValid) => {
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
            ])('cost 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (cost, isValid) => {
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
                ['', false]
            ])('level 필드 유효성 검사에 이상이 없을 시 error의 길이가 0이여야한다.', async (level, isValid) => {
                createPostRequestDto.level = level;
                const errors = await validate(createPostRequestDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            })
        })
    })
})
