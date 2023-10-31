import {UserEntity} from "./User.entity";

export interface UserRepository {
    findOneById(userId: number): Promise<UserEntity | null>

    findByEmail(email: string): Promise<UserEntity | null>

    findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null>

    findByAccount(account: string): Promise<UserEntity | null>

    findByNickName(nickName: string): Promise<UserEntity | null>

    save(user: UserEntity): Promise<UserEntity>
}