import {validate} from "class-validator";
import {CreateCategoryRequestDto} from "../dto/createCategory.request.dto";


describe('CreateCategoryRequestDto', () => {
    describe('name 유효성 검사', () => {
        const createCategoryRequestDto = new CreateCategoryRequestDto();
        it.each([
            ['해줘', true],
            ['줘', false],
            ['', false],
            ['카테고리명이 10글자를 넘어가면 오류가 발생합니다', false]
        ])('name 값이 유효하지않을 시 에러를 반환한다', async (name, isValid) => {
            createCategoryRequestDto.name = name;
            const errors = await validate(createCategoryRequestDto, {skipMissingProperties: true});

            if (isValid) expect(errors).toHaveLength(0);
            if (!isValid) expect(errors).not.toHaveLength(0);
        })
    })
})