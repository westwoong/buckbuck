import {UserEntity} from "../User.entity";
import {ApiProperty} from "@nestjs/swagger";

export class GetUsersResponseDto {
    @ApiProperty({
        description: '사용자 조회 데이터',
        example: [
            {
                account: 'foobar1324',
                name: '길동',
                email: 'example@example.com',
                nickname: '테스ter123',
            },
            {
                account: 'foobar2222',
                name: '홍길동',
                email: 'example222@example.com',
                nickname: '테스터2',
            },
        ],
        isArray: true,
        maxItems: 50,
        required: true
    })
    users: Array<{
        account: string,
        name: string,
        email: string,
        nickname: string,
    }>


    constructor(userList: UserEntity[]) {
        this.users = userList.map(user => ({
            account: user.account,
            name: user.name,
            email: user.email,
            nickname: user.nickName,
        }));
    }
}