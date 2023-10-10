import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {SignUpRequestDto} from "./dto/signUp.request.dto";
import {Repository} from "typeorm";
import {UserEntity} from "./User.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Transactional} from "typeorm-transactional";
import * as crypto from "crypto";
import {SignInRequestDto} from "./dto/signIn.request.dto";
import {AuthService} from "../auth/auth.service";
import {FindUserIdResponseDto} from "./dto/findUserId.response.dto";

const ITERATIONS = 105820;
const KEY_LENGTH = 64;

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService) {
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
        return
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return new Promise((resolve) => {
            crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'SHA512', (err, key) => {
                if (err) {
                    throw new InternalServerErrorException(err)
                }
                resolve(key.toString('base64'))
            });
        });
    }

    async signIn(signInRequestDto: SignInRequestDto) {
        const {account, password} = signInRequestDto;
        const user = await this.userRepository.findOne({
            where: {
                account: account
            }
        })
        if (!user) {
            throw new BadRequestException('로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주시길 바랍니다');
        }
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, user.salt, ITERATIONS, KEY_LENGTH, 'SHA512', async (err, buffer) => {
                const hashedPassword = buffer.toString('base64');
                (hashedPassword === user.password)
                    ? resolve(this.authService.signInWithJwt({userId: user.id}))
                    : reject(new BadRequestException('로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주시길 바랍니다'));
                if (err) {
                    throw new InternalServerErrorException(err);
                }
            });
        });
    }

    async findOneById(userId: number) {
        const user = await this.userRepository.findOne({where: {id: userId}});
        if (!user) throw new NotFoundException('해당 유저는 존재하지않습니다.');
        return new FindUserIdResponseDto(user);
    }
}
