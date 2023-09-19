import {UserEntity} from "../User.entity";

export class FindUserIdResponseDto {
    userId: number;

    constructor(findUserIdRequestDto: UserEntity) {
        this.userId = findUserIdRequestDto.id;
    }
}