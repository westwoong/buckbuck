import {Injectable} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./User.entity";
import {Repository} from "typeorm";

@Injectable()
export class TypeormUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
    }

    async findAll(): Promise<UserEntity[]> {
        let limit = 50;
        return await this.userRepository.find({
            order: {
                createdAt: "DESC"
            }, take: limit
        })
    }

    async findOneById(userId: number): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: {id: userId}
        })
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: {email: email}
        })
    }

    async findByAccount(account: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: {account: account}
        })
    }

    async findByNickName(nickName: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: {nickName: nickName}
        })
    }

    async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: {phoneNumber: phoneNumber}
        })
    }

    async save(user: UserEntity): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }
}