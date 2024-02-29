import {UserEntity} from "../User.entity";
import {ApiProperty} from "@nestjs/swagger";

export class FindUserIdResponseDto {
    @ApiProperty({
        description: '로그인을 한 사용자의 userId',
        example: 1,
    })
    userId: number;

    constructor(findUserIdRequestDto: UserEntity) {
        this.userId = findUserIdRequestDto.id;
    }
}