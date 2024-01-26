import {UserEntity} from "../User.entity";

export class FindUsersResponseDto {
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