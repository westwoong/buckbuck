import {ApiProperty} from "@nestjs/swagger";

export class CreateCategoryResponseDto {
    @ApiProperty({
        description: '카테고리 생성 시 반환 값',
        example: {
            name: '테스트 카테고리',
            createdAt: '2222-02-22T10:10:22.000Z'
        }
    })
    name: string;
    createdAt: Date;

    constructor(createCategoryResponseDto: CreateCategoryResponseDto) {
        this.name = createCategoryResponseDto.name;
        this.createdAt = createCategoryResponseDto.createdAt;
    }
}