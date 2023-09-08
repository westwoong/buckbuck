import {ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {SignUpRequestDto} from "./dto/signUp.request.dto";
import {Repository} from "typeorm";
import {UserEntity} from "./User.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Transactional} from "typeorm-transactional";
import * as crypto from "crypto";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>) {
    }

    @Transactional()
    async signUp(signUpRequestDto: SignUpRequestDto) {
        const {account, password, name, email, phoneNumber, nickName} = signUpRequestDto;
        const user = new UserEntity({account, password, name, email, phoneNumber, nickName});

        const isDuplicateEmail = await this.userRepository.findOne({
            where: {
                email: email
            }
        })
        if (isDuplicateEmail) {
            throw new ConflictException('해당 메일로 가입된 계정이 존재합니다');
        }

        const isDuplicatePhoneNumber = await this.userRepository.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        })
        if (isDuplicatePhoneNumber) {
            throw new ConflictException('해당 번호로 가입된 계정이 존재합니다');
        }

        const isDuplicateAccount = await this.userRepository.findOne({
            where: {
                account: account
            }
        })
        if (isDuplicateAccount) {
            throw new ConflictException('이미 존재하는 아이디 입니다.');
        }

        const isDuplicateNickName = await this.userRepository.findOne({
            where: {
                nickName: nickName
            }
        })
        if (isDuplicateNickName) {
            throw new ConflictException('이미 존재하는 닉네임 입니다.');
        }
        const salt = crypto.randomBytes(64).toString('base64');
        const hashedPassword = await this.hashPassword(password, salt);
        user.salt = salt;
        user.password = hashedPassword;

        await this.userRepository.save(user);
        return `안녕하세요 ${nickName}님 회원가입이 완료되었습니다`;
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        const iterations = 105820;
        const keyLength = 64;
        return new Promise((resolve) => {
            crypto.pbkdf2(password, salt, iterations, keyLength, 'SHA512', (err, key) => {
                if (err) {
                    throw new InternalServerErrorException(err)
                }
                resolve(key.toString('base64'))
            });
        });
    }
}
