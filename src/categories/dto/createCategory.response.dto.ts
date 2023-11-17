export class CreateCategoryResponseDto {
    name: string;
    createdAt: Date;

    constructor(createCategoryResponseDto: CreateCategoryResponseDto) {
        this.name = createCategoryResponseDto.name;
        this.createdAt = createCategoryResponseDto.createdAt;
    }
}