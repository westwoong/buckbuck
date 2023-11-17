import {validate} from "class-validator";
import {CreateCategoryRequestDto} from "../dto/createCategory.request.dto";


describe('CreateCategoryRequestDto', () => {
    describe('name 필드 validator 테스트 성공 검사', () => {
        const createCategoryRequestDto = new CreateCategoryRequestDto();
        it.each([
            ['해줘'],
            ['도와줘'],
            ['팔아줘'],
            ['가르쳐줘'],
        ])('입력한 name 값이 정상일 시 error 의 길이가 0이여야한다', async (name) => {
            createCategoryRequestDto.name = name;
            const errors = await validate(createCategoryRequestDto, {skipMissingProperties: true});

            expect(errors).toHaveLength(0);
        })
    })

    describe('name 필드 validator 테스트 실패 검사', () => {
        const createCategoryRequestDto = new CreateCategoryRequestDto();
        it.each([
            [''],
            ['줘'],
            ['카테고리명이 10글자를 넘어가면 오류가 발생합니다']
        ])('입력한 name 값이 validator 에 위반될 시 에러가 발생한다 ', async (name) => {
            createCategoryRequestDto.name = name;
            const errors = await validate(createCategoryRequestDto, {skipMissingProperties: true});

            expect(errors).not.toHaveLength(0);
        })
    })
})